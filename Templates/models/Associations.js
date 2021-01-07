// exemplo: const ##Entidade## = require('../models/##Entidade##')
//##RequireModel##

// Relacionamentos entre tabelas (fazer manualmente)
//Postagem.belongsTo(Categoria, {foreignKey: 'categoriaID', as: 'PostagemParaCategoria'})
//Categoria.hasMany(Postagem, {foreignKey: 'categoriaID', as: 'CategoriaParaPostagem'})

// exemplo: ##Entidade##.sync({force: false})
//##EntidadeSync##