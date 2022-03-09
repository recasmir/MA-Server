const { Schema, model } = require('mongoose');

const MemberAd = {
    fName: String,
    lName: String,
    email: String,
    title: String,
    body: String,
    date: Date,
    tags: [String]
}

const UsuarioSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pwd: {
        type: String,
        required: true
    },
    // repwd: {
    //     type: String,
    //     required: true
    // },
    location: {
        type: String,
        required: true
    },
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    age: {
        type: String
    },
    gender: {
        type: String
    },
    traveller: {
        type: String,
        required: true
    },
    nChildren: {
        type: Number
    },
    aChildren: {
        type: String
    },
    dog: {
        type: String
    },
    transport: {
        type: String,
        required: true
    },
    trip: {
        type: [String]
    },
    about: {
        type: String
    },
    terms: {
        type: Boolean
    },
    ads: {
        type:[MemberAd]
    }

});



module.exports = model('Usuario', UsuarioSchema);
