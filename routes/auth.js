
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken, actualizarUsusario, addContact, recuperarInfoUsuarios, recuperarUsuario, actualizarAllInfoUsusario } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Create new member
router.post('/register', [
    check('email', 'Email is compulsory').isEmail(),
    check('pwd', 'Password is compulsory').isLength({min:6}),
    check('location', 'Location is compulsory').not().isEmpty(),
    check('fName', 'First name is compulsory').not().isEmpty(),
    check('lName', 'Last Name is compulsory').not().isEmpty(),
    check('traveller', 'Type of traveller is compulsory').not().isEmpty(),
    check('transport', 'Type of transport is compulsory').not().isEmpty(),
    check('terms', 'You need to accept terms and conditions to be a member').not().isEmpty(),
    validarCampos
], crearUsuario);


//Login usuario
router.post('/', [
    check('email', 'Email is compulsory').isEmail(),
    check('pwd', 'Password is compulsory').isLength({min:6}),
    validarCampos
] , loginUsuario);

//Validar y revalidar JWT
router.get('/renew', validarJWT, revalidarToken);

//actualizar usuario, añadir ads
router.post('/update', actualizarUsusario);

//recuperar todos los usuarios
router.get('/all', recuperarInfoUsuarios);

//añadir contactos a través del contactForm
router.post('/addcontact', addContact);

//recuperar un usario via id
router.get('/usuario', recuperarUsuario);

//actualizar toda info usuario
router.post('/updateallinfo', actualizarAllInfoUsusario);


module.exports = router;