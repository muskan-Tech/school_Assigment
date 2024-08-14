const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

const indexRouter = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(session({
    secret: "school-portal-key",
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'upload_kml')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',indexRouter);


app.listen(PORT, (error)=>{
    if(error){
        console.log("There is some issue.");
    }else{
        console.log("Server is running on port: "+PORT);
    }
});