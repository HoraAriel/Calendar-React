const {response} = require('express');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');



//CREAR USUARIO
const crearUsuario = async(req, res = response) => {

    const { email, password} = req.body; 

    try { 
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'Otro usuario existe con ese correo'
            })
        }
        
         usuario = new Usuario(req.body);

         //encriptar contraseña
         const salt = bcrypt.genSaltSync();
         usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
        
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
             
        });
    
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adminostrador'
        })
    }
};

//LOGIN USUARIO
const loginUsuario = async (req, res  = response) => {

    const {email, password} = req.body

    try {
        const usuario = await Usuario.findOne({email});

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario no existe con ese email'
            })
        }
        //Confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword) {
            return res.status(400).json({
                ok:false,
                msg : 'Password Incorrecto'
            });
        }

        // Generar  JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adminostrador'
        })
    }
   

};

const revalidarToken = async(req, res = response) => {
    
    const {uid, name} = req;
   
    
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    })

}




module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}