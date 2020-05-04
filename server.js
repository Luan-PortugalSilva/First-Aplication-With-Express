const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const { middlewareGlobal } = require('./src/middlewares/middlewares')

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.resolve(__dirname, 'public')))

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

// Nossos próprios middlewares
app.use(middlewareGlobal)
app.use(routes);

app.listen(3001, () => {
    console.log('Servidor executando na porta 3001')
})


//         CRIAR   LER   ATUALIZAR  APAGAR
// CRUD -> CREATE, READ, UPDATE,    DELETE
//          POST   GET    PUT       DELETE

// http://meusite.com/ <- GET -> Entregue a página
// http://meusite.com/sobre <- GET -> Entregue a página /sobre
// http://meusite.com/contato <- GET -> Entregue a página /contato
// /profiles/3     == params
// /profiles/?chave1=valor1&chave2=valor2&chave3=valor3   == query