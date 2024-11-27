const express = require('express');
const session = require('express-session'); //npm install express-session
const cookieParser = require('cookie-parser');
const path = require('path')


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
    Surprise: ['concerned', 'exited', 'confused', 'happy'],

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

function generaliseColour(colour){
    //  colour is in form "#rrggbb" - array of length 7
    // get decimal value of each rgb
    hexIndicate = "0x"
    // red - take index 1,2 and concatenate to 0x
    red = hexIndicate.concat(colour.substring(1,3))
    red = Number(red)
    console.log(red)
    // green - take index 3,4 and concatenate to 0x
    green = hexIndicate.concat(colour.substring(3,5))
    green = Number(green)
    console.log(green)
    // blue - take index 5,6 and concatenate to 0x
    blue = hexIndicate.concat(colour.substring(5,7))
    blue = Number(blue)
    console.log(blue)
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
    // Check if the consent cookie exists
    if (!req.cookies.consent) {
        // Send HTML with a cookie consent banner
        res.send(`
            <h1>Welcome to Our Website</h1>
            <p>We use cookies to enhance your experience. Do you accept?</p>
            <button id="accept">Accept</button>
            <script>
                document.getElementById('accept').onclick = function() {
                    document.cookie = "consent=true; path=/; max-age=" + 60*60*24*30; // 30 days
                    location.reload();
                };
            </script>
        `);
    } else {
        res.render('index');
    }

});

app.get('/choose_shape', (req,res) => {
    res.render('choose_shape');
});

app.post('/submit-shape', (req,res) => {
    req.session.shape = req.body.shape
    var filePath = "images/"
    req.session.filePath = filePath.concat(req.session.shape, ".png")
    res.redirect('/choose_colour');
})
app.get('/choose_colour', (req,res) => {
    res.render('choose_colour', {filepath: req.session.filePath});
});

app.post('/submit-colour', (req, res) => {
    req.session.colour = req.body.colour;
    console.log(req.session.colour)
    res.redirect('/choose_word'); 
    generaliseColour(req.session.colour) //not sure if this is in the right place         
});

app.get('/choose_word', (req,res) => {
    res.render('choose_word');
});

app.post('/submit-word', (req, res) => {
    req.session.word = req.body.selectedEmotion;
     // Save mood in session
    res.redirect('/mood_summary');     // Redirect to mood summary page
});

app.get('/mood_summary', (req,res) => {
    const shape = req.session.shape;
    const colour = req.session.colour;
    const word = req.session.word;
    console.log(word)
    const potentialMoods = getSharedWords(shape, colour, word)
    //Gets associations between all of the choicees
    let mood;
    const randomIndex = Math.floor(Math.random() * potentialMoods.length)
    mood = potentialMoods[randomIndex]

    req.session.mood = mood;
    res.render('mood_summary', {mood: req.session.mood});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
