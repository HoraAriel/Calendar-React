/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const {check} = require('express-validator')
const router = Router();

const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const{validarJWT} = require('../middlewares/validar-jwt');



router.post(
    '/new',
    
    [//middlewares
        check('name', 'El nombre es oblegatorio').not().isEmpty(),
        check('email', 'El email es oblegatorio').isEmail(),
        check('password', 'El password debe contener 6 caracteres').isLength({min:6}),
        validarCampos
    ],

     crearUsuario
     );

router.post(
    '/',
    [
        
        check('email', 'El email es oblegatorio').isEmail(),
        check('password', 'El password debe contener 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUsuario
);

router.get('/renew',validarJWT, revalidarToken);

module.exports = router;