const Sequelize = require('sequelize')
const config = require('../config/config.js')

    //Conexão com o BD MySQL
    const bd = new Sequelize(config.database.name,config.database.user,config.database.password,
                    { host:config.database.host, dialect: config.database.dialect
                })

    bd.authenticate().then(conectado).catch(erro)

    function conectado() {
        console.log("BD conectado")
    }
    
    function erro(e) {
        console.log("Falha na conexão: "+e)
    }

    module.exports = {
        Sequelize: Sequelize,
        bd: bd
    }