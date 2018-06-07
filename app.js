const express = require('express');

const app = express();

//Index Route
// GET REQUEST: if you type in a URL, click a link
//POST: to update database, post something on a server

//Middleware
app.use((req, res, next) =>
   { console.log(Date.now());
      req.name = "Thomas";
      next();
});

//Index Route
app.get('/', (req, res) => {
   res.send('INDEX');
   console.log(req.name);
});

//About route
app.get('/about', (req, res) => {
   res.send('ABOUT2');
});

const port= 5000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});
