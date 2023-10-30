const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000; 

// Models
const Resume = require('./models/resume');

// Controllers
const resumeController = require('./controllers/resumeController');

// Routes
const resumeRouter = require('./routes/resume');

app.use(resumeRouter);

app.use(express.static('public'));


//mongoose.connect('mongodb+srv://yididiya:mnYxZgzDQhULh2Ow@cluster0.de0jhxk.mongodb.net/shekilaStock-DB?retryWrites=true&w=majority').then(result=> {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
// }).catch(err=> {
//   console.log(err);
// })
