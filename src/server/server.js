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

app.post('/submit-shape', (req,res) => {
    var selectedShape = req.shape
    res.render('choose_colour', {shape: selectedShape});
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
