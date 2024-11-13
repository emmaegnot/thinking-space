const express = require('express');
const path = require('path')


const app = express();
const port = 3000;


app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../views'))

app.use(express.static(path.join(__dirname,'../public')));

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/choose_shape', (req,res) => {
    res.render('choose_shape');
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
//     res.render('additional_words', {filepath: "images/star.png", colour, wordList});
// });

app.post('/submit-shape', (req,res) => {
    var selectedShape = req.shape
    res.render('choose_colour', {shape: selectedShape});
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
