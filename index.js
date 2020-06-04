const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta') // só de importar ja funciona, essa é a minha tabela do SQL
const Resposta = require('./database/Resposta') // Essa é a tabela das respostas
// Database
connection
    .authenticate()
    .then(() =>{
        console.log('Conexão feita com o banco de dados')
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })
// Faz o express usar o ejs como view engine
app.set('view engine', 'ejs')
app.use(express.static('public'))
// BodyParser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Rotas
app.get('/', function(req, res){
    //SELECT * FROM PERGUNTAS
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(function(perguntas){
        res.render('index',{
            perguntas: perguntas
        })
    }) 
    

})

app.get('/perguntar', function(req, res){
    res.render('perguntar')
})

// Essa rota recebe os dados do formulario
app.post('/salvarpergunta', function(req, res){
    let titulo = req.body.titulo // O body parser adidiona esse 'body' que faz com que eu consiga pegar os dados do formulario
    let descricao = req.body.descricao
   
    Pergunta.create({ // Mesma coisa que o INSERT INTO TABELA... só que em JS
        titulo: titulo,
        descricao: descricao
    }).then(function(){
        res.redirect('/')
    })
})

// Rota que leva para a pagina de uma pergunta especifica
app.get('/pergunta/:id', (req, res) =>{
    let id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if (pergunta != undefined){

            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order:[['id', 'DESC']]
            }).then(respostas =>{
                res.render('pergunta_especifica', {
                    pergunta: pergunta, //Passa a pergunta especifica para o front-end
                    respostas: respostas
            })
            })
        }else{
            res.redirect('/')
        }
    })
})


app.post('/responder', (req, res) =>{
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect('/pergunta/'+ perguntaId)
    })

})

app.listen(8000, function(erro){
    console.log('Servidor Abriu')
})
