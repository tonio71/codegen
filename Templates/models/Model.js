const Banco = require ('./BD')

	//modelos
	var ##Entidade## = Banco.bd.define('##Entidade##',{
		nome: {type: Banco.Sequelize.STRING, allowNull: false},
        slug: {type: Banco.Sequelize.STRING, allowNull: false},
        date: {type: Banco.Sequelize.DATE, defaultValue: Banco.Sequelize.NOW}
    })

    module.exports = ##Entidade##