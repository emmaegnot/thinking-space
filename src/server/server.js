const express = require('express');
const session = require('express-session'); //npm install express-session
const path = require('path')


const app = express();
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
    green: ['calm'],
    yellow: ['happy'],
    blue: ['dreamy'],
    black: ['scared', 'isolated']
}
const words = {

}
// Find shared associations among word, shape and colour
function getSharedWords(shape, colour, word) {
    const shapeWords = shapes[shape] || [];
    const colourWords = colours[colour] || [];
    const wordWords = words[word] || [];

    // Combine all associations into a single array
    const combinedWords = [...shapeWords, ...colourWords, ...wordWords];

    // Create a frequency map for the associations
    const wordCount = {};
    combinedWords.forEach(word => {
        if (word) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });

    // Check if all counts are 1
    const allCountsAreOne = Object.values(wordCount).every(count => count === 1);
    if (allCountsAreOne) {
        return []; // Return an empty array if all counts are 1 since no common associations
    }

    // Find the maximum count and the associated associations
    let maxCount = 0;
    const mostFrequentWords = [];
    for (const [word, count] of Object.entries(wordCount)) {
        if (count > maxCount) {
            maxCount = count;
            mostFrequentWords.length = 0; // Clear the array
            mostFrequentWords.push(word);
        } else if (count === maxCount) {
            mostFrequentWords.push(word);
        }
    }

    return mostFrequentWords; // Return the most frequent associations
}


app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../views'))

app.use(session({
    secret: /*process.env.SESSION_SECRET ||*/ 'we_should_come_up_with_a_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // secure should be true in production when using HTTPS
}));

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.urlencoded({extended:true}))


app.get('/', (req,res) => {
    delete req.session.shape;
    delete req.session.colour;
    delete req.session.word;
    delete req.session.mood;
    res.render('index');
});

app.get('/choose_shape', (req,res) => {
    delete req.session.colour;
    delete req.session.word;
    delete req.session.mood;
    res.render('choose_shape');
});

app.post('/submit-shape', (req,res) => {
    req.session.shape = req.body.shape
    res.redirect('/choose_colour');
})

app.post('/submit-colour', (req, res) => {
    delete req.session.word;
    delete req.session.mood;
    req.session.colour = req.body.colour;  
    res.redirect('/choose_word');          
});

app.post('/submit-word', (req, res) => {
    delete req.session.mood;
    req.session.word = req.body.word;   // Save word selection to session
    res.redirect('/summary');           // Redirect to the summary page
});
app.post('/submit-word', (req, res) => {
    const shape = req.session.shape;
    const colour = req.session.color;
    const word = req.body.word;

    const potentialMoods = getSharedWords(shape, colour, word)
    //Gets associations between all of the choicees
    let mood;
    if (potentialMoods.length === 0) {
        mood = 'undecisive'; // We will have to think about this one
    }
    else{
        const randomIndex = Math.floor(Math.random() * potentialMoods.length)
        mood = potentialMoods[randomIndex]
    }

    req.session.mood = mood; // Save mood in session
    res.redirect('???');     // Redirect to mood summary page
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
