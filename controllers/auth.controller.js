const { response } = require('express');
const Usuario = require('../models/Usuario');
const Contacto = require('../models/contacto')
const bcrypt = require('bcryptjs');
const { generarJWT } =require('../helpers/jwt');
const { Router } = require('express');

const crearUsuario = async(req, res = response) => {

    const{ email, pwd, location, fName, lName, traveller, transport, terms, age, gender, nChildren, aChildren, dog, trip, about, ads } = req.body;

    try {

    //Verificar el email
    const usuario = await Usuario.findOne({email});

    if(usuario){
        return res.status(400).json({
            ok:false,
            msg:'There is already a member with this email.'
        })
    }

    //Crear usuario con el modelo
    const dbUser = new Usuario (req.body);

    //Hashear (encripatar) contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.pwd = bcrypt.hashSync(pwd,salt);

    //Generat JWT
    const token = await generarJWT( dbUser.id, fName);

    //Crear usuario de base de datos
    await dbUser.save();

    //Generar respuesta exitosa
    return res.status(201).json({
        ok:true,
        uid:dbUser.id,
        email,
        pwd,
        location,
        fName,
        lName,
        age,
        gender,
        traveller,
        nChildren,
        aChildren,
        dog,
        transport,
        trip,
        about,
        terms,
        ads,
        token
       })

    } catch (error) {
        return res.json({
            ok: false,
            msg: 'Please, talk to the administrator.'
        })
    }

}

const loginUsuario = async (req, res = response) => {

    const {email, pwd} = req.body;

    try {
        const dbUser = await Usuario.findOne({email});

        if( !dbUser ) {
            return res.status(400).json({
                ok:false,
                msg:'Email and/or password are not valid.' 
            });
        }

        //confirmar si el password hace match.
        const validPassword = bcrypt.compareSync( pwd, dbUser.pwd);
       
        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg:'Email and/or password are not valid.' 
            });
        }
        //Generar JWT
        const token = await generarJWT(dbUser.id, dbUser.fName);

        return res.json({
            ok:true,
            uid:dbUser.id,
            email:dbUser.email,
            location:dbUser.location,
            fName:dbUser.fName,
            lName:dbUser.lName,
            age:dbUser.age,
            gender:dbUser.gender,
            traveller:dbUser.traveller,
            nChildren:dbUser.nChildren,
            aChildren:dbUser.aChildren,
            dog:dbUser.dog,
            transport:dbUser.transport,
            trip:dbUser.trip,
            about:dbUser.about,
            ads:dbUser.ads,
            token
           })
    

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please, talk to the administrator.'
        })
    }
}


const revalidarToken = async (req, res = response) => {

    const {uid} = req;

    //el dbUser contiene toda la información del usuario
    const dbUser = await Usuario.findById(uid);

    //generamos otro JWT
    const token = await generarJWT(uid, dbUser.fName);

    return res.json({
        ok: true,
        uid,
        email:dbUser.email,
        location:dbUser.location,
        fName:dbUser.fName,
        lName:dbUser.lName,
        age:dbUser.age,
        gender:dbUser.gender,
        traveller:dbUser.traveller,
        nChildren:dbUser.nChildren,
        aChildren:dbUser.aChildren,
        dog:dbUser.dog,
        transport:dbUser.transport,
        trip:dbUser.trip,
        about:dbUser.about,
        ads:dbUser.ads,
        token
    })

}

const actualizarUsusario = async (req, res = response) => {
    
    const { email, fName, lName, ads } = req.body;

    try{

    const dbUser = await Usuario.updateOne(
             { email },
             {
               $set: { 'ads': ads },
               $currentDate: { lastModified: true }
             }
           );  
           console.log('after set', ads)
    return res.json({
        ok:true,
        fName,
        lName,
        email,
        ads
    

    })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Please, contact the administrator.'
        })
    }

}

const actualizarAllInfoUsusario = async (req, res = response) => {
    
    const{ email, location, fName, lName, traveller, transport, age, gender, nChildren, aChildren, dog, trip, about } = req.body;

    try{

    const dbUser = await Usuario.updateOne(
             { email },
             {
               $set: { 'location': location, 'fName': fName, 'lName': lName,'traveller': traveller, 'transport': transport, 'age': age, 'gender': gender, 'nChildren': nChildren, 'aChildren': aChildren, 'dog': dog, 'trip': trip, 'about': about },
               $currentDate: { lastModified: true }
             }
           );  
           console.log('after set', dbUser)
    return res.json({
        ok:true,
        fName,
        lName,
        email,
        location,
        traveller,
        transport,
        age,
        gender,
        nChildren,
        aChildren,
        dog,
        trip,
        about
    

    })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Please, contact the administrator.'
        })
    }

}

// $set: { 'fName': fName },
// $set: { 'lName': lName },
// $set: { 'traveller': traveller },
// $set: { 'transport': transport },
// $set: { 'age': age },
// $set: { 'gender': gender },
// $set: { 'nChildren': nChildren },
// $set: { 'aChildren': aChildren },
// $set: { 'dog': dog },
// $set: { 'trip': trip },
// $set: { 'about': about },

const addContact = async (req, res = response) =>{

    const{fNameContact, lNameContact, emailContact, commentsContact} = req.body;
    console.log(req.body);
    try{
        const dbContacto = new Contacto(req.body);
        await dbContacto.save();
        return res.status(201).json({
            ok:true,
            uid:dbContacto.id,
            msg:'Message sent successfully.',
            fNameContact,
            lNameContact,
            emailContact,
            commentsContact
        })
    }catch (error) {
        return res.json({
            ok: false,
            msg: 'Please, talk to the administrator.'
        })
    }
}

const recuperarInfoUsuarios = async (req, res = response) => {
 
    const dbUser = await Usuario.find({});

    console.log(dbUser);
   
    return res.send(dbUser);
}

const recuperarUsuario = async (req, res = response) => {

    const {email} = req.body;

    const dbUser = await Usuario.find({email});

    console.log(dbUser);

    return res.send(dbUser);
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    actualizarUsusario,
    addContact,
    recuperarInfoUsuarios,
    recuperarUsuario,
    actualizarAllInfoUsusario
}