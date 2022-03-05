const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } =require('../helpers/jwt')

const crearUsuario = async(req, res = response) => {

    const{ email, pwd, location, fName, lName, age, gender, traveller, nChildren, aChildren, dog, transport, trip, about } = req.body;

    try {

    //Verificar el email
    const usuario = await Usuario.findOne({email});

    if(usuario){
        return res.status(400).json({
            ok:false,
            msg:'El usuario ya existe con este email.'
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
        token
       })

    } catch (error) {
        return res.json({
            ok: false,
            msg: 'Por favor hable con el administrador'
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
                msg:'Credenciales no son válidas.' 
            });
        }

        //confirmar si el password hace match.
        const validPassword = bcrypt.compareSync( pwd, dbUser.pwd);
       
        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg:'Credenciales no son válidas.' 
            });
        }
        //Generar JWT
        const token = await generarJWT(dbUser.id, dbUser.fName);

        return res.json({
            ok:true,
            uid:dbUser.id,
            fName: dbUser.fName,
            email:dbUser.email,
            token
           })
    

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
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
        fName: dbUser.fName,
        email: dbUser.email,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}