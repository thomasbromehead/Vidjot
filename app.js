const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose'); //Require the modules everytime.

const app = express();



//Index Route
// GET REQUEST: if you type in a URL, click a link
//POST: to update database, post something on a server

//Middleware

   //Handlebars middleware
   app.engine('handlebars', exphbs({defaultLayout: 'main'}));
   app.set('view engine', 'handlebars');


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
//About route
app.get('/about', (req, res) => {
   const title = "About handlebars";
   res.render('about', {
      title: title
   });
});

const port= 5000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});
