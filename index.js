const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/userRouter');
const adminRoute = require('./routes/adminRouter');

mongoose.connect('mongodb://127.0.0.1:27017/userManagement_system')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.set('view engine', 'ejs');
app.set('views', './views');


app.use('/', userRoute);
app.use('/admin',adminRoute);


app.listen('3000', () => {
    console.log('server has started');
})