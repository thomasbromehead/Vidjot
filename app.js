const express = require('express');
const path = require('path'); //Path mpodule is a core NodeJs module
const exphbs = require('express-handlebars');
const mongoose = require('mongoose'); //Require the modules everytime.
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Load Router
const ideas = require('./routes/ideas');
const users = require('./routes/users');




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

   //Static Folder
   app.use(express.static(path.join(__dirname, 'public')));
   // Joins current directory __dirname and public. Sets public folder to be the Express static folder

   //Method Override Middleware to handle PUT request to update video idea
   app.use(methodOverride('_method'));

   //Express Session Middleware
   app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    }))

    app.use(flash());

   //Global variables
    app.use(function(req, res, next){
       res.locals.success_msg = req.flash('success_msg');
       res.locals.error_msg = req.flash('error_msg');
       res.locals.error = req.flash('error');
       next();
    });

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


//Use Router
app.use('/ideas', ideas); //Any link that starts with /ideas will use the ideas routes.
app.use('/users', users);



const port= 5000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});
