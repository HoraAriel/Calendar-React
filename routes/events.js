/*
    Event Routes
    /api/events
*/
const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validarCampos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {getEventos, crearEvento, actualizarEvento, eliminarEvento,} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use(validarJWT);

router.get( 
    '/', getEventos);

router.post(
    '/',
    [
        check('tittle','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha inicio obligatorio').custom(isDate),
        check('end','Fecha finalización obligatorio').custom(isDate),
        validarCampos
    ],
     crearEvento
    );

router.put('/:id', actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;