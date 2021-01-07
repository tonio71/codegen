//
// Template para criação de controller de Entidades
//

const model##Entidade## = require ('../models/##Entidade##')

class ##Entidade##Controller {

	listar##Entidade##(req,res){  
        model##Entidade##.findAll(
            {  order: [['date', 'DESC']] }
        )
        .then( function(array##Entidade##){
                res.render('##Entidade##/listar##Entidade##', {array##Entidade##: array##Entidade##})
            })
        .catch( function(erro){
            req.flash('error_msg', 'Erro na consulta'+erro)
            res.redirect('/')
        })
    }

    formCad##Entidade## ( req , res ){
        res.render('##Entidade##/formAddAlt##Entidade##')
    }

    formAlt##Entidade## ( req , res ){
        model##Entidade##.findOne(
            {  where: {id:req.params.id} }
        )
        .then( function(um##Entidade##){
                um##Entidade##.dataValues.senha2=um##Entidade##.dataValues.senha
                res.render('##Entidade##/formAddAlt##Entidade##', {##Entidade##: um##Entidade##.dataValues})
        })
        .catch( function(erro){
            req.flash('error_msg', 'Erro na consulta'+erro)
            res.redirect('/##Entidade##/listar##Entidade##')
        })
    }

    async addAlt##Entidade## ( req , res ){
        var erros = []
		// Escrever código para validação
		// var erros = Validação##Entidade##(req)

        
        if(erros.length > 0){
            res.render('##Entidade##/formAddAlt##Entidade##', {##Entidade##:req.body, erros : erros})
        }
        else{                
            var novo##Entidade## = {
				nome: req.body.nome,
                slug: req.body.slug
            }
            if (req.body.id.length == 0){
                model##Entidade##.create(novo##Entidade##)
                .then( function(item){
					req.flash('success_msg', 'Cadastrado com sucesso!!!')
					res.redirect('/##Entidade##/listar##Entidade##')
				})
                .catch( (erro) => {
                    req.flash('error_msg', 'Erro!!! Não foi possível cadastrar. '+erro)
                    res.redirect('/##Entidade##/listar##Entidade##')
                })
			}else{ 
                model##Entidade##.update(novo##Entidade##,
                    {where: {id:req.body.id}})
                .then( function(){
                    req.flash('success_msg', 'Alterado com sucesso!!!')
                    res.redirect('/##Entidade##/listar##Entidade##')
                })
                .catch( function(erro){
                    req.flash('error_msg', 'Erro!!! Não foi possível alterar. ' + erro)
                    res.redirect('/##Entidade##/listar##Entidade##')
                })
            }
        }
    }
	
	exc##Entidade##(req, res){
        model##Entidade##.destroy({where: {'id' : req.params.id}})
        .then( function(){
            req.flash('success_msg', 'Exclusão efetuada com sucesso!!!')
            res.redirect('/##Entidade##/listar##Entidade##')
            })
        .catch( function(erro){
            req.flash('error_msg', 'Erro!!! Não foi possível excluir. '+erro)
            res.redirect('/##Entidade##/listar##Entidade##')
        })  
    }
	
}
module.exports = new ##Entidade##Controller()