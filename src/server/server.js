const express = require('express');
const path = require('path')


const app = express();
app.use(express.urlencoded({extended:true}))
const port = 3000;


app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../views'))

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.urlencoded({extended:true}))


app.get('/', (req,res) => {
    res.render('index');
});

app.get('/choose_shape', (req,res) => {
    res.render('choose_shape');
});

app.post('/submit-shape', (req,res) => {
    var selectedShape = req.body.shape

    var filePath = "images/"
    filePath = filePath.concat(selectedShape, ".png")
    console.log(filePath)
    res.render('choose_colour', {shape: selectedShape, filepath: filePath});

})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
