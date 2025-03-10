const express = require('express');
const session = require('express-session'); //npm install express-session
const cookieParser = require('cookie-parser');
const path = require('path');
const { closeSync } = require('fs');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const bcrypt = require('bcrypt');

var db = true;

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const port = 3000;
const shapes = {
    cloud: ['friendly', 'comfortable', 'happy', 'dreamy'],
    circle: ['calm', 'friendly', 'connected'],
    square: ['stable', 'calm', 'confused'],
    //parallelogram: ['unstable'],
    // hexagon: ['connected'],
    star: ['excited', 'dreamy'],
    triangle: ['angry', 'concerned', 'scared'],
    spikeyball: ['irritated', 'scared', 'isolated']
};
const colours = {
    red: ['angry', 'scared'],
    orange: ['comfortable'],
    green: ['calm'],
    yellow: ['happy'],
    cyan: ['dreamy'],
    navy: ['dreamy'],
}
const words = {
    Angry: ['angry', 'concerned', 'confused', 'irritated'],
    Disgusted: ['irritated'],
    Fearful: ['scared', 'confused'],
    Happy: ['happy', 'excited', 'dreamy'],
    Sad: ['sad', 'concerned'],
    Surprised: ['concerned', 'excited', 'confused', 'happy'],

}

// define vectors on unpleasant-calm graph, x ( positive is unpleasant, negative is pleasant), y (positive is calm, negative is excited)
// this information has come from cross-modal correspondence research
const shapeVectors = {
    star: [0.5, -2.5],
    spikeyball: [-5, -5],
    circle: [-5, 5],
    cloud: [-1, 1.5],
    triangle: [3, -3],
    square: [-3, 3.5],
    bouba: [1, 1],
    diamond: [1, -1]
}

const word1Vectors = {
    angry: [4.5, -5],
    disgusted: [5, -2],
    fearful: [5, -3.5],
    happy: [-5, 5],
    sad: [4, 3],
    surprised: [0, -4]
}

const colourVectors = {
    green: [-0.5, 0.5],
    yellow: [3.5, 0.5],
    cyan: [-4.5, 2.5],
    navy: [-3.5, 2.5],
    orange: [1, -3],
    red: [-1.5, -4]
}

const moodVectors = {
    alert: [-1, -5],
    excited: [-4, -4],
    happy: [-5, -0.5],
    content: [-5, 1],
    relaxed: [-4, 4],
    angry: [5, -5],
    calm: [-1, 5],
    bored: [1, 5],
    upset: [4.5, 3.5],
    sad: [5, 1],
    distressed: [4, -3],
    tense: [0.5, -5],
}

const wordAddVectors = {
    irritated: [3, -2],
    resentful: [3.5, -1],
    miffed: [1, -1],
    upset: [4.5, 3.5],
    mad: [4, -5],
    furious: [4.5, -5],
    raging: [3.5, -5],
    hot: [-4, 1],
    awful: [5, 0],
    disappointed: [2, 3],
    repelled: [2, 0.5],
    horrified: [4, -3],
    hesitant: [0, 0],
    judgemental: [1, 1],
    embarrassed: [2, -3],
    revolted: [3, -1],
    scared: [3.5, -2.5],
    anxious: [4, -1],
    insecure: [4, 0],
    weak: [3, 4],
    rejected: [3, 0],
    threatened: [2, -2.5],
    nervous: [1.5, -4],
    helpless: [3, 4],
    playful: [-4, -4],
    interested: [-2, 2],
    optimistic: [-4, 5],
    inspired: [-3, 5],
    proud: [-5, 4],
    thankful: [-5, 4.5],
    cheeky: [-3, -1],
    free: [-3.5, -1],
    lonely: [4, 2.5],
    hurt: [4.5, 1],
    guilty: [3, 0.5],
    powerless: [2, 1],
    abandoned: [3, 1],
    ashamed: [3.5, 1],
    confused: [0, 0],
    amazed: [-3.5, -1.5],
    excited: [0, -5],
    startled: [1, -3],
    shocked: [0, -3],
    eager: [-1.5, 3],
    energetic: [-1.5, -4]
}

function matchMood(shape, colour, word1, words, force){
    // get value of three vectors corresponding to shape, colour, word
    shapeVector = shapeVectors[shape];
    colourVector = colourVectors[colour];
    word1Vector = word1Vectors[word1];
    addWordsVector =[0,0]
    for (let i = 0; i < words.length; i++) {
        addWordsVector[0] = addWordsVector[0] + wordAddVectors[words[i]][0];
        addWordsVector[1] = addWordsVector[1] + wordAddVectors[words[i]][1];
      }
    addWordsVector = [addWordsVector[0]/words.length, addWordsVector[1]/words.length]
    // find average of the three vectors
    averageVector = [ (shapeVector[0] + colourVector[0] + word1Vector[0] + addWordsVector[0])/3, (shapeVector[1] + colourVector[1] + word1Vector[1]+ addWordsVector[1])/3];
    // multiply by feeling force div 10
    averageVector[0] = averageVector[0] * (0.5 + (force/10))
    averageVector[1] = averageVector[1] * (0.5 + (force/10))
    // use the same code as generalise colour function to find the closest mood to the average vector
    minDistance = 10000;
    let closestMood = null;
    for (const mood in moodVectors){
        unpleasantLength = (averageVector[0] - moodVectors[mood][0]) * (averageVector[0] - moodVectors[mood][0]);
        excitedLength = (averageVector[1] - moodVectors[mood][1]) * (averageVector[1] - moodVectors[mood][1]);
        distance = Math.sqrt(unpleasantLength + excitedLength)
        if (distance < minDistance){
            minDistance = distance
            closestMood = mood
        }
    }
    // return that current mood
    console.log("MOOD: ",closestMood);
    return closestMood;
}

const additionalWords = {
    Angry: ['Irritated', 'Resentful', 'Miffed', 'Upset', 'Mad', 'Furious', 'Raging', 'Hot'],
    Disgusted: ['Awful', 'Disappointed', 'Repelled', 'Horrified', 'Hesitant', 'Judgmental', 'Embarrassed', 'Revolted'],
    Fearful: ['Scared', 'Anxious', 'Insecure', 'Weak', 'Rejected', 'Threatened', 'Nervous', 'Helpless'],
    Happy: ['Playful', 'Interested', 'Optimistic', 'Inspired', 'Proud', 'Thankful', 'Cheeky', 'Free'],
    Sad: ['Lonely', 'Hurt', 'Guilty', 'Powerless', 'Abandoned', 'Ashamed', 'Disappointed', 'Embarrassed'],
    Surprised: ['Confused', 'Amazed', 'Excited', 'Startled', 'Shocked', 'Eager', 'Energetic', 'Disappointed'],

}
// Find shared associations among word, shape and colour
function getSharedWords(shape, colour, word) {
    // Fetch words associated with the shape, colour, and word
    const shapeWords = shapes[shape] || [];
    const colourWords = colours[colour] || [];
    const wordWords = words[word] || [];

    // Create an array combining all words
    const combinedWords = [...shapeWords, ...colourWords, ...wordWords];

    // Create a frequency map for the words
    const wordCount = {};
    combinedWords.forEach(w => {
        if (w) {
            wordCount[w] = (wordCount[w] || 0) + 1;
        }
    });

    // Filter for common words that appear in at least two categories
    const commonWords = Object.keys(wordCount).filter(word => wordCount[word] > 1);

    // If no common words are found, return "indecisive"
    if (commonWords.length === 0) {
        return ['indecisive'];
    }

    // Find the most frequent words from the common words
    let maxCount = 0;
    const mostFrequentWords = [];

    commonWords.forEach(word => {
        const count = wordCount[word];
        if (count > maxCount) {
            maxCount = count;
            mostFrequentWords.length = 0; // Clear the array
            mostFrequentWords.push(word);
        } else if (count === maxCount) {
            mostFrequentWords.push(word);
        }
    });

    // Return the most frequent shared words
    return mostFrequentWords;
}


function colourToDec(colour){
    hexIndicate = "0x"
    red = hexIndicate.concat(colour.substring(1,3))
    red = Number(red)
    green = hexIndicate.concat(colour.substring(3,5))
    green = Number(green)
    blue = hexIndicate.concat(colour.substring(5,7))
    blue = Number(blue)
    return [red,green,blue]
}

function generaliseColour(RGBAcolour){
    var RGBAcolour = RGBAcolour.replace(/[^\d,.]/g, '').split(',');
    const colour = [];
    for (let i = 0; i < RGBAcolour.length; i++) {
        colour.push(Number(RGBAcolour[i]));
    }
    //  colour is in form "#rrggbb" - array of length 7
    // now colour is in form rgba (r , g , b, a)
    // define RGB values for the colour set {red, orange, blue, green, yellow, pink, purple, black, white}
    // colours map {red:[r,g,b,dist], orange: [r,g,b, dist]
    const definedColours = new Map();
    definedColours.set("red", [255,0,0])
    definedColours.set("orange", [255,165,0])
    definedColours.set("blue", [0,0,255])
    definedColours.set("green", [0,255,0])
    definedColours.set("yellow", [255,255,0])
    definedColours.set("pink", [255,192,203])
    definedColours.set("purple", [128,0,128])
    definedColours.set("black", [0,0,0])
    definedColours.set("white", [255,255,255])
    minDistance = 10000
    closestColour = "none";
    // for each colour, find the euclidean distance between the input rgb colour and the predefined colour
    definedColours.forEach(function(value,key){
        redLength = (colour[0] - value[0]) * (colour[0] - value[0])
        greenLength = (colour[1] - value[1]) * (colour[1] - value[1])
        blueLength = (colour[2] - value[2]) * (colour[2] - value[2])
        distance = Math.sqrt(redLength + greenLength + blueLength)
        if (distance < minDistance){
            minDistance = distance
            closestColour = key
        }
    })
    return closestColour
}

// Connect to MongoDB
// This is done by looking into the .env file (which is not tracked for security) for a connection string
// Your own connection string can be generated by: 
// 1. creating a MongoDB Atlas account
// 2. being added to the ThinkingSpace project
// 3. adding your IP address to the table of known users
// 4. connecting to the cluster using drivers
// 5. Pasting this string in your .env file: MONGO_URI=mongodb+srv://admin_user:<password>@your-cluster.mongodb.net/myDatabase?retryWrites=true&w=majority
// 6. Replacing the admin_user and password with your one
async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env file");
        }
        await mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1)
    }
}
if (process.env.MONGO_URI != null){
    connectDB();
} else {
    console.log("Skipping database connection");
    db = false;
}

// Example for getting users - localhost:3000/db-test should result in showing all teachers and all students in the database
app.get('/db-test', async (req, res) => {
    if (db){
        try {
            // Fetch teachers but exclude passwords for security
            const teachers = await Teacher.find({}, "-password");
            // Fetch all students
            const students = await Student.find();
            // Return JSON response
            res.json({ teachers, students });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch data" });
        }
    }
});


app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../views'))

app.use(session({
    secret: /*process.env.SESSION_SECRET ||*/ 'we_should_come_up_with_a_key',
    resave: false,
    saveUninitialized: true,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'../public')));
app.use(express.urlencoded({extended:true}))

const requireStep = (requiredStep) => (req, res, next) => {
    if (!req.session.progress || req.session.progress < requiredStep) {
        req.session.destroy();
        return res.redirect("/");
    }
    next();
};

const requireLogin = (requiredLogin) => (req, res, next) => {
    if (!req.session.logged || (req.session.logged !== requiredLogin) || (req.session.userRole !== "teacher")){
        return res.redirect("/");
    }
    next();
};


app.get('/', (req,res) => {
    req.session.destroy(() => {
        console.log("req.session is deleted :)");
    });
    
    res.render('index', { title: "Home", showConsentPopup: !req.cookies.consent });
});


app.get('/student_login', (req, res) => {
    req.session.userRole = 'student';
    res.render('student_login', {title: "Student Login"})

});

app.post('/student_login', (req, res) => {
    req.session.name = req.body.name;
    req.session.studentCode = req.body.classcode 
    req.session.progress = 1;
    res.redirect('/choose_shape');
});

app.get('/teacher_login', (req, res) => {
    res.render('teacher_login', {title: "Teacher Login"});
    req.session.logged = 0;
    req.session.userRole = 'teacher';
});

app.post('/teacher_login', async (req,res) => {
    const username = req.body.name;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    if(db){
        try {
            const user = await Teacher.findOne({ username });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (!user.password.startsWith("$2b$")) { 
                console.warn("Unhashed password detected! Hashing it now.");
                user.password = await bcrypt.hash(user.password, 10);
                await user.save(); 
            }
        
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Save user session
            req.session.user = { name: user.username };
            req.session.userRole = 'teacher';
            req.session.logged = 1;
            res.json({ redirect: '/student_info' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        return res.status(401).json({ error: 'The server has not connected to the database' });
    }
});

app.get('/student_info', requireLogin(1), (req, res) => {
    res.render('student_info', {title: "Student Info"})
});

app.get('/choose_shape', requireStep(1),(req,res) => {
    req.session.userRole = 'student';
    res.render('choose_shape', {title: "Choose A Shape"});
});

app.post('/previous-shape', (req,res) => {
    res.redirect('/');
})

app.post('/next-shape', (req,res) => {
    req.session.shape = req.body.shape;
    req.session.progress = 2;
    var filePath = "images/"
    req.session.filePath = filePath.concat(req.session.shape, ".png");
    res.redirect('/choose_colour');
})
app.get('/choose_colour', requireStep(2), (req,res) => {
    req.session.userRole = 'student';
    res.render('choose_colour', {filepath: req.session.filePath, title: "Choose A Colour", selectedColour: req.session.colour});
});

app.post('/previous-colour', (req,res) => {
    req.session.progress = 2;
    res.redirect('/choose_shape');
})

app.post('/next-colour', (req, res) => {
    req.session.colour = req.body.colour;
    req.session.progress = 3;
    //req.session.colour = generaliseColour(req.session.colour) //not sure if this is in the right place
    res.redirect('/choose_word'); 
    
});


app.get('/choose_word', requireStep(3), (req,res) => {
    req.session.userRole = 'student';
    res.render('choose_word', {title: "Choose A Word"});
});

app.post('/previous-word', (req,res) => {
    req.session.progress = 3;
    res.redirect('/choose_colour');
})

app.post('/next-word', (req, res) => {
    req.session.word = req.body.selectedEmotion;
    req.session.progress = 4;
    var filePath = "images/";
    req.session.filePath = filePath.concat(req.session.shape, ".png");
    res.redirect('/additional_words');     
});

app.get('/additional_words', requireStep(4),(req,res) => {
    req.session.userRole = 'student';
    res.render('additional_words', {filepath: req.session.filePath, title: "More Words", wordList : additionalWords[req.session.word]});
});

app.post('/previous-additional', (req,res) => { //back
    req.session.progress = 4;
    res.redirect('/choose_word');
})

app.post('/next-additional', (req, res) => {
    req.session.additional = req.body.words;
    req.session.progress = 5;
    res.redirect('/feeling_force');     
});


app.get('/feeling_force', requireStep(5), (req,res) => {
    req.session.userRole = 'student';
    res.render('feeling_force', {title: "Feeling Force"});
});

app.post('/previous-force', (req,res) => { //back
    req.session.progress = 5
    res.redirect('/additional_words');
})

app.post('/submit-force', (req, res) => { //next
    req.session.force = req.body.clickCount;
    req.session.progress = 6;  
    //clickCount = req.body.clickCount; // Update stored value

    res.redirect('/mood_summary');          
});


const StudentMood = require('../models/Student')

app.get('/mood_summary', requireStep(6),async (req,res) => {
    req.session.userRole = 'student';
    const shape = req.session.shape;
    const colour = req.session.colour;
    const force = req.session.force;
    const wordDB = req.session.word;
    const addWords = req.session.additional;
   
    // let word = req.session.word.toLowerCase();
    let mood = "indecisive";

    if(req.session.word != undefined){
        word = req.session.word.toLowerCase();
        let words = req.session.additional;
        if (typeof words == "string"){
            words = [words]
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i].toLowerCase();
            }
        } else if (words != undefined){
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i].toLowerCase();
            }
        } else {
            words = []
        }
    
        console.log(shape)
        console.log(colour)
        console.log(word)
        console.log(force +"/10")
        console.log(words)
        const potentialMoods = getSharedWords(shape, colour, word)
        //Gets associations between all of the choicees
        const randomIndex = Math.floor(Math.random() * potentialMoods.length)
        mood = potentialMoods[randomIndex]
        mood = matchMood(shape, colour, word, words, force)
    }

    req.session.mood = mood;

    if(db){
        try {
            await StudentMood.create({
                name: req.session.name, // change to name when implemented
                classCode: req.session.studentCode,
                ushape: shape,
                ucolor: colour,
                uword: wordDB,
                uadditionalWords: addWords, 
                uforce: force,
                umood: req.session.mood, 
            });
            console.log("Mood data saved!");
        } catch (error) {
            console.error("Error saving mood data:", error);
        }
    }
    
    res.render('mood_summary', {mood: req.session.mood, title: "Mood Summary"});
});

app.post('/previous-mood', (req,res) => { //back
    req.session.progress = 6;
    res.redirect('/mood_summary');
})

app.post('/submit-mood', (req, res) => { //next
    req.session.progress = 7;
    res.redirect('/what_happened');          
});


app.get('/what_happened', requireStep(7), (req,res) => {
    req.session.userRole = 'student';
    res.render('what_happened', {title: "What Happened"});
});

app.post('/previous-happen', (req,res) => { //back
    req.session.progress = 7;
    res.redirect('/mood_summary');
})

app.post('/submit-text', (req, res) => { //next     
    req.session.what = req.body.what;  
    const what = req.session.what;
    req.session.progress = 8;
    console.log(what);
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = {generaliseColour, server, app, shapes, colours, words, connectDB, additionalWords};
