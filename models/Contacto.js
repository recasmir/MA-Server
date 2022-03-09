const { Schema, model } = require('mongoose');

const ContactoSchema = Schema({
    fNameContact:String,
    lNameContact:String,
    emailContact:String,
    commentsContact:String
})

module.exports = model('Contact', ContactoSchema)