const express = require('express');
const session = require('express-session'); //npm install express-session
const cookieParser = require('cookie-parser');
const path = require('path');
const { closeSync } = require('fs');

const app = express();
app.use(express.urlencoded({extended:true}))
const port = 3000;
const shapes = {
    cloud: ['friendly', 'comfortable', 'happy', 'dreamy'],
    circle: ['calm', 'friendly', 'connected'],
    square: ['stable', 'calm', 'confused'],
    parallelogram: ['unstable'],
    hexagon: ['connected'],
    star: ['excited', 'dreamy'],
    triangle: ['angry', 'concerned', 'scared'],
    spikeyball: ['irritated', 'scared', 'isolated']
};
const colours = {
    red: ['angry', 'scared'],
    orange: ['comfortable'],
    green: ['calm'],
    yellow: ['happy'],
    blue: ['dreamy'],
    black: ['scared', 'isolated']
}
const words = {
    Angry: ['angry', 'concerned', 'confused', 'irritated'],
    Disgusted: ['irritated'],
    Fearful: ['scared', 'confused'],
    Happy: ['happy', 'excited', 'dreamy'],
    Sad: ['sad', 'concerned'],
    Surprised: ['concerned', 'exited', 'confused', 'happy'],

}

// define vectors on unpleasant-calm graph, x is increasing pleasant to unpleasant, y is excited to calm
// this information has come from cross-modal correspondence research
const shapeVectors = {
    star: [0.5, -2.5],
    spikes: [-5, -5],
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

function matchMood(shape, colour, word1, force){
    
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
    console.log(RGBAcolour)
    var RGBAcolour = RGBAcolour.replace(/[^\d,.]/g, '').split(',');
    const colour = [];
    for (let i = 0; i < RGBAcolour.length; i++) {
        colour.push(Number(RGBAcolour[i]));
    }
    console.log(colour)
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
    console.log(closestColour)
    return closestColour
}



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


app.get('/', (req,res) => {

    res.render('index', { title: "Home", showConsentPopup: !req.cookies.consent });
    // Check if the consent cookie exists
    // if (!req.cookies.consent) {
    //     // Send HTML with a cookie consent banner
    //     res.send(`
    //         <h1>Welcome to Our Website</h1>
    //         <p>We use cookies to enhance your experience. Do you accept?</p>
    //         <button id="accept">Accept</button>
    //         <script>
    //             document.getElementById('accept').onclick = function() {
    //                 document.cookie = "consent=true; path=/; max-age=" + 60*60*6; // 6 hours
    //                 location.reload();
    //             };
    //         </script>
    //     `);
    // } else {
        
    //     res.render('index', {title: "Home"});
    // }

});

app.get('/choose_shape', (req,res) => {
    res.render('choose_shape', {title: "Choose A Shape"});
});

//PLACEHOLDER - Allows for testing of additional_words, must comment out lines 14-16
// app.get('/', (req,res) => {
//// Testing variables for now, server will do this in the future
//     const colour = {
//         r: 255,
//         g: 0,
//         b: 0,
//     }
//     // The words should be computed by server, then sent to a request like this (ideally)
//     // I.e. in this case the original word picked was angry
//     wordList = ['Irritated', 'Resentful', 'Miffed', 'Upset', 'Mad', 'Furious', 'Raging', 'Hot']
//     res.render('additional_words', {filepath: "images/star.png", colour, wordList, title: "Additional words"});
// });

app.post('/previous-shape', (req,res) => {
    res.redirect('/');
})

app.post('/next-shape', (req,res) => {
    req.session.shape = req.body.shape
    var filePath = "images/"
    req.session.filePath = filePath.concat(req.session.shape, ".png")
    res.redirect('/choose_colour');
})
app.get('/choose_colour', (req,res) => {
    res.render('choose_colour', {filepath: req.session.filePath, title: "Choose A Colour"});
});

app.post('/previous-colour', (req,res) => {
    res.redirect('/choose_shape');
})

app.post('/next-colour', (req, res) => {
    req.session.colour = req.body.colour;
    //req.session.colour = generaliseColour(req.session.colour) //not sure if this is in the right place
    res.redirect('/choose_word'); 
    
});

app.get('/choose_word', (req,res) => {
    res.render('choose_word', {title: "Choose A Word"});
});

app.post('/previous-word', (req,res) => {
    res.redirect('/choose_colour');
})

app.post('/next-word', (req, res) => {
    req.session.word = req.body.selectedEmotion;
     // Save mood in session
    res.redirect('/feeling_force');     // Redirect to feeling force page
});

app.get('/feeling_force', (req,res) => {
    res.render('feeling_force', {title: "Feeling Force"});
});

app.post('/previous-force', (req,res) => { //back
    res.redirect('/choose_word');
})

app.post('/submit-force', (req, res) => { //next
    req.session.force = req.body.clickCount;  
    //clickCount = req.body.clickCount; // Update stored value

    res.redirect('/mood_summary');          
});

app.get('/mood_summary', (req,res) => {
    const shape = req.session.shape;
    const colour = req.session.colour;
    const word = req.session.word;

    const force = req.session.force
    console.log(shape)
    console.log(colour)
    console.log(word)
    console.log(force +"/10")
    const potentialMoods = getSharedWords(shape, colour, word)
    //Gets associations between all of the choicees
    let mood;
    const randomIndex = Math.floor(Math.random() * potentialMoods.length)
    mood = potentialMoods[randomIndex]

    req.session.mood = mood;
    res.render('mood_summary', {mood: req.session.mood, title: "Mood Summary"});
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = {generaliseColour, server, app};
