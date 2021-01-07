const localStrategy = require('passport-local').Strategy
const bcrypt = require ('bcryptjs')
const Usuario = require ('../models/Usuario')
const passport = require('passport')

function validar(passport){
    passport.use(new localStrategy ( {usernameField: 'email', passwordField: 'senha'}, (email, senha, done)=>{
        Usuario.findOne(
            {  where: {email:email} }
        )
        .then( function(umUsuario){
            if(!umUsuario){
                return done(null, false, {message: 'Esta conta não existe'})
            }
            bcrypt.compare(senha, umUsuario.senha, (erro, batem) => {
                if(batem){
                    return done(null, umUsuario)
                }
                else{
                    return done(null, false, {message: 'Senha incorreta'})
                }
                    
            })
        })
        .catch( function(erro){
            return done(null, false, {message: 'Falha interna'})
        })
    }))
    
    passport.serializeUser( (usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser( (vid, done) => {
        Usuario.findOne({  where: {id:vid} })
        .then(function (umUsuario){
            done(null, umUsuario)
        })
        .catch(function (err){
            done(err, null)
        })
    })
}

module.exports = validar