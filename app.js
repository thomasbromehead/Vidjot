const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose'); //Require the modules everytime.
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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

   //Method Override Middleware to handle PUT request to update video idea
   app.use(methodOverride('_method'));

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

//Idea Index Page
app.get('/ideas', (req, res) => {
      Idea.find({}) //to find all objects in the mongoose collection
      .sort({date:1}) //sort ascending
      .then(ideas => {
        // console.log(ideas);
         res.render('ideas/index', {
            ideas:ideas
         })
      });
});

//Add Idea Form
app.get('/ideas/add', (req, res) => {
   res.render('ideas/add');
});

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => { //Pass in the id of the mongoose idea
   Idea.findOne({
      _id: req.params.id
   })
   .then(idea => {
      res.render('ideas/edit',
      {
         idea:idea
      });
   });
});

//Edit Form process -- catching a put request
app.put('/ideas/:id', (req, res) => {
   Idea.findOne({
      _id: req.params.id
   })
   .then( idea => {
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save()
      .then(idea => {
         res.redirect('/ideas');
      });
   });
});

//Process Form with a Post request
app.post('/ideas', (req, res) => {

 // Server Side Validation
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
   //Default Success Case
  } else {
      const newUser = {
         title: req.body.title,
         details: req.body.details,
      }
      new Idea(newUser) //from line 40, mongoose.model('ideas')
      .save()
      .then(ideas => {
         res.redirect('/ideas');
      })
  }

});

//Delete Idea -- catching a delete request, URLs can be same as edit form, so long as the method is different ie here app.delete
app.delete('/ideas/:id', (req, res) => {
   Idea.remove({
      _id : req.params.id
   })
   .then(() => {
      res.redirect('/ideas');
   })
});



const port= 5000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});
