const Sequelize = require('sequelize')
const connection = require('./database')

// Definindo o Model
const Pergunta = connection.define('pergunta', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },

    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

// Sincroniza com o banco de dados, se a tabela ja existir ele n vai criar outra (false)
Pergunta.sync({force: false}).then(function(){
    console.log('Tabela Criada')
})

module.exports = Pergunta