if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}
const express=require('express')                 
const app=express()
const expressLayouts=require('express-ejs-layouts')

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL)
const db=mongoose.connection

db.once('open',() => console.log('MongoDB connected 🎉'))
db.on('error',(err) => console.error('MongoDB connection error:', err));

app.set('view engine','ejs')

app.set('layout','layouts/layout')
app.use(expressLayouts)

app.use(express.static('public'))
app.listen(process.env.PORT||5000)
