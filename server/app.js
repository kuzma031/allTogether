const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// cors enable
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    next();
});

const userRoutes = require('./routes/user');
const mainRoutes = require('./routes/main'); 

app.use('/user', userRoutes);
app.use('/', mainRoutes);

// Error handler
app.use((error, req, res, next) => {
    console.log(error)
    return res.status(400).json({ success: false, message: `Server error - ${error.name}` });
});

const connect = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    if(conn) app.listen(process.env.PORT || 4000);
}

module.exports = connect;