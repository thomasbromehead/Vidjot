const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//replace app.get/delete etc with router.get

//User Login Route
router.get('/login', (req, res)=>{
   res.render('users/login');
});

//User Register Route
router.get('/register', (req, res)=>{
   res.render('users/register');
});

//User Register Form POST
router.post('/register', (req, res) => {
   let errors = [];
   
   if(req.body.password != req.body.password2){
      errors.push({
         text: "Passwords do not match"
      })
   }

   if(req.body.password.length < 4){
      errors.push({
         text: "Passwords must be at least 4 characters"
      });
   }

   if(errors.length > 0 ){
      res.render('users/register', { //re-render form with content already filled in
         errors: errors,
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         password2: req.body.password2
      }); 
   } else  {
      red.send('passed');
   }
});

module.exports = router;
