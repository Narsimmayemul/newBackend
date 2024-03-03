const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.url;
const connection = mongoose.connect(url);

const Model_Schema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum:["student" , "teacher"]}
});

const User_Model = mongoose.model("login" , Model_Schema);

module.exports={User_Model , connection};