const fs = require("fs")
const fsPromises = fs.promises;

const  parametros = process.argv
var caminho = process.cwd()
nomeAplicacao = caminho.substr( caminho.lastIndexOf("\\")+1, caminho.length)+".js";
console.log("=====> xxxx " + nomeAplicacao)

if(parametros.length <=2){
	console.log("Digite os parâmetros para a geração de código")
	return 1
}

switch(parametros[2]) {
  case 'Estrutura':
		criarEstrutura()
		break
  case 'Entidade':
		if (!parametros[3]){
			console.log("Entre com o nome da entidade tambem!")
			return 1;
		}
		for ( var i=3; i<parametros.length; i++ ) {	
			criarEntidade(parametros[i])
			gerarRoute(parametros[i])
			gerarController(parametros[i])
			gerarViews(parametros[i])
			gerarModeloEntidade(parametros[i])
		}
		InserirModelEmAssociation(parametros.slice(3))
		InserirRouteNoMainApp(parametros.slice(3))
		break
  case 'GerarRoutes':
		for ( var i=3; i<parametros.length; i++ ) {	
			gerarRoute(parametros[i])
		}
		break
  case 'GerarControllers':
		for ( var i=3; i<parametros.length; i++ ) {	
			gerarController(parametros[i])
		}
		break
case 'GerarViews':
		for ( var i=3; i<parametros.length; i++ ) {	
			gerarViews(parametros[i])
		}
		break

case 'GerarMainApp':
		if (!parametros[3]){
			console.log("Entre com o nome da entidade tambem!")
			return 1;
		}
		InserirRouteNoMainApp(parametros.slice(3))
		break
	
case 'GerarModel':
		for ( var i=3; i<parametros.length; i++ ) {	
			gerarModeloEntidade(parametros[i])
		}
		InserirModelEmAssociation(parametros.slice(3))
		break
} 


// Insere os modelos das entidades dentro do arquivo Associations.js (relacionamento entre tabelas)
function InserirModelEmAssociation(entidade){
	console.log("Inserindo modelos de entidades " + entidade + " em Associations.js")

	fs.readFile("models/Associations.js", 'utf-8', function ( erro, arquivo ){
		if(erro){
			console.log(erro);
			return 1 
		}

		console.log("===> ORIGINAL \n",arquivo)
		
	// Monta a linha de require das entidades
	requer = "" 
	sinc = ""
	for(var i=0; i<entidade.length; i++){
		requer = requer + "const ##Entidade## = require('../models/##Entidade##') \n"
		requer = requer.replace(/##Entidade##/g, entidade[i]);

		sinc = sinc + "##Entidade##.sync({force: false}) \n"
		sinc = sinc.replace(/##Entidade##/g, entidade[i]);

	}
	requer = requer + "/\/##RequireModel##"
	sinc = sinc + "/\/##EntidadeSync##"

	console.log("===> ", requer)
	console.log("===> ", sinc)
	// insere a rota no arquivo principal da aplicação
	var novoConteudo = arquivo.replace(/\/\/##RequireModel##/g, requer);
	var novoConteudo = novoConteudo.replace(/\/\/##EntidadeSync##/g, sinc);



		console.log("=====> COM Require e Sync \n",novoConteudo)

		// Salvar o arquivo alterado com o nome da entidade
		fsPromises.writeFile("models/Associations.js", novoConteudo , function ( erro ){
			if(erro){
				console.log(err);
				return 1 
			}
		})
		console.log("Entidade inserida com sucesso em models\Associations.js ")
	})
}

// geração do arquivo de Model de uma Entidade
function gerarModeloEntidade(entidade){
	const fs = require("fs")
	const fsPromises = fs.promises;
	
	// Ler o arquivo template de controller
	console.log("Gerando arquivo Model da entidade "+entidade+"...")
	fs.readFile('c:/codegen/Templates/models/Model.js', 'utf-8', function ( erro, arquivo ){
		if(erro){
			console.log(erro);
			return 1
		}

		console.log("====> template ", arquivo)
		
		// substituir a flag ##Entidade## pelo nome da entidade
		var novoConteudo = arquivo.replace(/##Entidade##/g, entidade);
		
		console.log("====> NOVO",novoConteudo)
		
		// Salvar o arquivo alterado com o nome da entidade
		fsPromises.writeFile("models/"+entidade+".js", novoConteudo , function ( erro ){
			if(erro){
				console.log(err);
				return 1 // retorna com erro
			}
		})
		console.log("Arquivo de model salvo com sucesso"+'models/'+entidade+'.js')
	})	
}

// Insere a configuração de rotas no servidor dentro do arquivo principal da aplicação
function InserirRouteNoMainApp(entidade){
	console.log("Inserindo rota(s) da(s) entidade(s) " + entidade + " no arquivo principal da aplicação " + nomeAplicacao)

	fs.readFile(nomeAplicacao, 'utf-8', function ( erro, arquivo ){
		if(erro){
			console.log(erro);
			return 1 
		}

		console.log("====> Inserindo Rota da Entidade "+entidade+ " no "+nomeAplicacao)
		console.log("===> ORIGINAL \n",arquivo)
		
	// Monta a linha de rota
	rota = ""
	requer = ""
	for(var i=0; i<entidade.length; i++){
		rota = rota + "servidor.use('/##Entidade##', ##Entidade##Route) \n\t\t"
		rota = rota.replace(/##Entidade##/g, entidade[i]);

		requer = requer + "const ##Entidade##Route = require ('./routes/##Entidade##Routes') \n"
		requer = requer.replace(/##Entidade##/g, entidade[i]);
	} 
	rota = rota + "/\/##INSERIR_ROTAS##"
	requer = requer + "/\/##REQROUTES##"
	console.log("===>ROTTTAAA ",rota)
	console.log("===>ROTTTAAA ",requer)

	// insere a rota no arquivo principal da aplicação
	var novoConteudo = arquivo.replace(/\/\/##INSERIR_ROTAS##/g, rota);
	var novoConteudo = novoConteudo.replace(/\/\/##REQROUTES##/g, requer);

		console.log("=====> COM ROTAS E REQUIRES DE ENTIDADES \n",novoConteudo)

		// Salvar o arquivo alterado com o nome da entidade
		fsPromises.writeFile(nomeAplicacao, novoConteudo , function ( erro ){
			if(erro){
				console.log(err);
				return 1 
			}
		})
		console.log("Rotas e Requires inseridos no arquivo principal da aplicação "+nomeAplicacao)
	})
}


// geração do código das views de uma entidade
	function gerarView(entidade, view){
		const fs = require("fs")
		const fsPromises = fs.promises;
		console.log("Gerando código de view para 1 entidade "+entidade+"..."+view)
		fs.readFile('c:/codegen/Templates/views/'+view, 'utf-8', function ( erro, arquivo ){
			if(erro){
				console.log(erro);
				return 1 
			}
			console.log("====> template "+view+"\n",arquivo)
			
			// substituir a flag ##Entidade## pelo nome da entidade
			var novoConteudo = arquivo.replace(/##Entidade##/g, entidade);

			var nomeArq = view.slice(0,view.indexOf("##")) + entidade + '.hbs'
			
			console.log("====> NOVO "+nomeArq,novoConteudo)

			// Salvar o arquivo alterado com o nome da entidade
			fsPromises.writeFile("views/"+entidade+'/'+nomeArq, novoConteudo , function ( erro ){
				if(erro){
					console.log(err);
					return 1 
				}
			})
			console.log("Arquivo de view salvo "+"views/"+nomeArq)
		})
	}

	function gerarViews(entidade){
		var views = ['tabela##Entidade##.hbs','formAddAlt##Entidade##.hbs']

		for (var view of views) {
			gerarView(entidade, view)		
		}		
	}

// geração do código do Controller de uma entidade
	function gerarController(entidade){
		const fs = require("fs")
		const fsPromises = fs.promises;
		
		// Ler o arquivo template de controller
		console.log("Gerando código de controller para entidade "+entidade+"...")
		fs.readFile('c:/codegen/Templates/Controller.js', 'utf-8', function ( erro, arquivo ){
			if(erro){
				console.log(erro);
				return 1
			}

			console.log("====> template ",arquivo)
			
			// substituir a flag ##Entidade## pelo nome da entidade
			var novoConteudo = arquivo.replace(/##Entidade##/g, entidade);
			
			console.log("====> NOVO",novoConteudo)
			
			// Salvar o arquivo alterado com o nome da entidade
			fsPromises.writeFile("Controllers/"+entidade+"Controller.js", novoConteudo , function ( erro ){
				if(erro){
					console.log(err);
					return 1 // retorna com erro
				}
			})
			console.log("Arquivo de controller salvo "+'Controllers/'+entidade+'Controller.js')
		})	
	}

// geração do código do arquivo de rotas de uma entidade
function gerarRoute(entidade){
	const fs = require("fs")
	const fsPromises = fs.promises;
	
	// Ler o arquivo template de rotas
	console.log("Gerando código de rotas para entidade "+entidade+"...")
	fs.readFile('c:/codegen/Templates/CRUDRoutes.js', 'utf-8', function ( erro, arquivo ){
		if(erro){
				console.log(erro);
				return 1 
			}

	
		// substituir a flag ##Entidade## pelo nome da entidade
		var novoConteudo = arquivo.replace(/##Entidade##/g, entidade);
	
		// Salvar o arquivo alterado com o nome da entidade
		fsPromises.writeFile("routes/"+entidade+"Routes.js", novoConteudo , function ( erro ){
			if(erro){
				console.log(err);
				return 1 // retorna com erro
			}
		})
		console.log("Arquivo de rotas salvo "+'routes/'+entidade+'Route.js')
	})	
}

// criação de Entidade
function criarEntidade(entidade){
	const fs = require("fs")
	const fsPromises = fs.promises;
	
	// criar pasta da entidade dentro da view
	fsPromises.mkdir("views/"+entidade, erroCriacaoEntidade)
	
	// criar o arquivo de rotas da entidade
	fsPromises.writeFile("routes/"+entidade+"Routes.js", "// arquivo de rotas da entidade "+entidade, erroCriacaoEntidade)
	
	// criar o controller da entidade
	fsPromises.writeFile("controllers/"+entidade+"Controller.js", "// arquivo de rotas da entidade "+entidade, erroCriacaoEntidade)
	
	// criar o model da entidade
	fsPromises.writeFile("models/"+entidade+".js", "// arquivo de rotas da entidade "+entidade, erroCriacaoEntidade)
	
}
function erroCriacaoEntidade(err) {
  if (err) {
	// console.log("Erro na criação de Entidade")
    console.log(err)
  } else {
    console.log("Entidade criada!")
  }
}

// criação da Estrutura default
	async function criarEstrutura(){
		const fsExtra = require("fs-extra")
		const fs = require("fs")
		const fsPromises = fs.promises

		fsExtra.copy("C:/codegen/Templates/node_modules","node_modules", erroCriacaoPasta )

		fsExtra.copy("C:/codegen/Templates/config","config", erroCriacaoPasta )
		/* fsPromises.mkdir("config", erroCriacaoPasta )
			fs.copyFile("C:/codegen/Templates/config/auth.js","config/auth.js", erroCriacaoPasta )
			fs.copyFile("C:/codegen/Templates/config/config.js","config/config.js", erroCriacaoPasta )	 */

		fsPromises.mkdir("controllers", erroCriacaoPasta )
		
		fsExtra.copy("C:/codegen/Templates/helpers","helpers", erroCriacaoPasta )
		// fsPromises.mkdir("helpers", erroCriacaoPasta )
		
		fsPromises.mkdir("models", erroCriacaoPasta )
			fs.copyFile("C:/codegen/Templates/models/BD.js","models/BD.js", erroCriacaoPasta )
			fs.copyFile("C:/codegen/Templates/models/Associations.js","models/Associations.js", erroCriacaoPasta )

			
		fsExtra.copy("C:/codegen/Templates/public","public", erroCriacaoPasta )
		/* await fsPromises.mkdir("public", erroCriacaoPasta )
			fsPromises.mkdir("public/css", erroCriacaoPasta )
			fsPromises.mkdir("public/img", erroCriacaoPasta )
			fsPromises.mkdir("public/js", erroCriacaoPasta )*/

		fsPromises.mkdir("routes", erroCriacaoPasta )
		await fsPromises.mkdir("views", erroCriacaoPasta )

		fsExtra.copy("C:/codegen/Templates/views/layouts","views/layouts", erroCriacaoPasta )
		fsExtra.copy("C:/codegen/Templates/views/partials","views/partials", erroCriacaoPasta )

			/*fsPromises.mkdir("views/layouts", erroCriacaoPasta )
				fs.copyFile("C:/codegen/Templates/views/layouts/principal.hbs","views/layouts/principal.hbs", erroCriacaoPasta )
			fsPromises.mkdir("views/partials", erroCriacaoPasta )
				fs.copyFile("C:/codegen/Templates/views/partials/_msg.hbs","views/partials/_msg.hbs", erroCriacaoPasta )
				fs.copyFile("C:/codegen/Templates/views/partials/_navbar.hbs","views/partials/_navbar.hbs", erroCriacaoPasta )*/

		fsPromises.mkdir("validacao", erroCriacaoPasta )
		fs.copyFile("c:/codegen/templates/MainApp.js",nomeAplicacao, erroCriacaoPasta )
	// criar arquivo de licença
	fsPromises.writeFile("license.txt", "Escreva aqui os termos da licença do software" ,erroCriacaoPasta)
	}

function erroCriacaoPasta(err) {
  if (err) {
    console.log(err)
  } else {
    console.log("Pasta criada!")
  }
}