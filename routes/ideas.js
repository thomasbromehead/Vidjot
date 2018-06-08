const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require ('../helpers/auth');
//destructuring allows us to pull out the function with {}


//Load Idea Model
require('../models/Ideas'); //Bring model in
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', (req, res) => {
   Idea.find({user: req.user.id}) //to find all objects in the mongoose collection leave empty, otherwise filter so only idea owner sees his/her ideas
   .sort({date:1}) //sort ascending
   .then(ideas => {
     // console.log(ideas);
      res.render('ideas/index', {
         ideas:ideas
      })
   });
});

//Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => { //Pass in the id of the mongoose idea
Idea.findOne({
   _id: req.params.id //_id is the key name in mongoose
})
.then(idea => {
  if(idea.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/ideas');
  } else {
    res.render('ideas/edit',
    {
       idea:idea
    });
  }
});
});

//Edit Form process -- catching a put request
router.put('/:id', ensureAuthenticated, (req, res) => {
Idea.findOne({
   _id: req.params.id
})
.then( idea => {
   //new values
   idea.title = req.body.title;
   idea.details = req.body.details;
   idea.save()
   .then(idea => {
      req.flash('success_msg', 'Video idea updated!');
      res.redirect('/ideas');
   });
});
});

//Process Form with a Post request
router.post('/', ensureAuthenticated, (req, res) => {

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
  res.render('/add',{
     errors: errors,
     title: req.body.title,
     details: req.body.details
  });
//Default Success Case
} else {
   const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
   }
   new Idea(newUser) //from line 40, mongoose.model('ideas')
   .save()
   .then(ideas => {
      req.flash('success_msg', 'Video idea added');
      res.redirect('/ideas');
   })
}

});

//Delete Idea -- catching a delete request, URLs can be same as edit form, so long as the method is different ie here app.delete
router.delete('/:id', ensureAuthenticated, (req, res) => {
Idea.remove({
   _id : req.params.id
})
.then(() => {
   req.flash('success_msg', 'Video Idea removed');
   res.redirect('/ideas');
})
});




module.exports = router;
