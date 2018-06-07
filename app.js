const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose'); //Require the modules everytime.
const bodyParser = require('body-parser');

const app = express();



//Index Route
// GET REQUEST: if you type in a URL, click a link
//POST: to update database, post something on a server

//Middleware

   //Handlebars middleware
   app.engine('handlebars', exphbs({defaultLayout: 'main'}));
   app.set('view engine', 'handlebars');

   //Body Parser Middleware
   app.use(bodyParser.urlencoded({ extended: false }))
   app.use(bodyParser.json())

//Index Route
app.get('/', (req, res) => {
   const title = "Welcome to Vidjot";
   res.render('index', {
      title: title
   });
});

// Connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot') //Could have been a remote db such as mitLab
.then( () =>  console.log('Mongodb connected...'))
.catch(err => console.log(err));

//Load Idea Model
require('./models/Ideas'); //Bring model in
const Idea = mongoose.model('ideas');

//About route
app.get('/about', (req, res) => {
   const title = "About handlebars";
   res.render('about', {
      title: title
   });
});

//Add Idea Form
app.get('/ideas/add', (req, res) => {
   res.render('ideas/add');
});

//Process Form with a Post request
app.post('/ideas', (req, res) => {
  let errors = [];
  let counter = 0;

  if(!req.body.title){
     errors.push({text:'Please add a title!'});
     counter ++
  } 
  if(!req.body.details){
     errors.push({text: 'Please add some details'});
     counter ++
  }
  if(errors.length > 0) {
     res.render('ideas/add',{
        errors: errors,
        title: req.body.title,
        details: req.body.details
     });
  } else {
     res.send('passed');
  }
  console.log(errors);
  console.log(counter);
});


const port= 5000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});
