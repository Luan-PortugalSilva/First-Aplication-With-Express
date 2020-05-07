require('dotenv').config() // variáveis de ambiente
const { middlewareGlobal, 
    checkCsrfError,
    csrfMiddleware } = require('./src/middlewares/middlewares') // requerindo os middlewares

const express = require('express'); //requerindo o express
const app = express(); // iniciante o express
const path = require('path'); // trabalhar com caminhos

const csrf = require('csurf') // criação de tokens para cada formulário
const helmet = require('helmet'); // sistema de segurança

const routes = require('./routes'); // rotas da nossa aplicação, ex: /contato, /home ...

const session = require('express-session'); // indentificar um navegador de um cliente, salvar um cookie
const MongoStore = require('connect-mongo')(session); // as sessões seram salvas na base de dados
const flash = require('connect-flash'); // msg rápida e auto destrutivas, msg salvas na sessão
const mongoose = require('mongoose'); // requerindo o mongoose e quem modela as bases de dados



mongoose.connect(process.env.CONNECTIONSTRING, { 
    useNewUrlParser: true,
    useUnifiedTopology: true })
        .then(() => {                 // Conexão com o banco de dados e tratamento de erros
        app.emit('pronto')
    })
        .catch(e => console.log(e))




app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public'))) // acesso direto, arquivos estáticos

const sessionOptions = session({
    secret: 'adsadawdawd',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
});
app.use(sessionOptions) // usando as sessões
app.use(flash()) // usando o flash

app.set('views', path.resolve(__dirname, 'src', 'views')) // acesso direto, arquivos estáticos
app.set('view engine', 'ejs')

app.use(csrf()) // usando o csrf
// Nossos próprios middlewares
app.use(middlewareGlobal)  // usando os middleware
app.use(checkCsrfError) // usando os middleware
app.use(csrfMiddleware) // usando os middleware
app.use(routes); // usando as rotas


app.on('pronto', () => { // escutando primeiro a conexão do banco de dados
    app.listen(3001, () => {    // sendo carregado depois do banco de dados
        console.log('Servidor executando na porta 3001')
    })
})






//         CRIAR   LER   ATUALIZAR  APAGAR
// CRUD -> CREATE, READ, UPDATE,    DELETE
//          POST   GET    PUT       DELETE

// http://meusite.com/ <- GET -> Entregue a página
// http://meusite.com/sobre <- GET -> Entregue a página /sobre
// http://meusite.com/contato <- GET -> Entregue a página /contato
// /profiles/3     == params
// /profiles/?chave1=valor1&chave2=valor2&chave3=valor3   == query