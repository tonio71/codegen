//
// Template para criação de arquivo de rotas tratar o CRUD de Entidades
//

const express = require("express")
const router = express.Router()


const ##Entidade##Controller = require ('../controllers/##Entidade##Controller')

//const {eAdmin, eVender} = require("../helpers/eAdmin")

//Rotas da Entidade
//router.get('/categorias',  eAdmin, CategoriaController.listarCategorias)

router.get('/listar##Entidade##',  ##Entidade##Controller.tabela##Entidade##)
router.get('/formCad##Entidade##', ##Entidade##Controller.formCad##Entidade##)
router.get('/formAlt##Entidade##/:id', ##Entidade##Controller.formAlt##Entidade##)
router.post('/addAlt##Entidade##', ##Entidade##Controller.addAlt##Entidade##)
router.get('/exc##Entidade##/:id', ##Entidade##Controller.exc##Entidade##)

module.exports = router