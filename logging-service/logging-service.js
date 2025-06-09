const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.clear()

var db = new sqlite3.Database('./logging.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível conectar ao SQLite.');
        throw err;
    }
    console.log('Conectado ao SQLite.');
});

// Cria a tabela 
db.run(`CREATE TABLE IF NOT EXISTS logging (
        evento TEXT NOT NULL,
        status TEXT NOT NULL, 
        descricao TEXT NOT NULL,
        horario TEXT NOT NULL
        )`,[], (err) => {
            if (err) {
                console.log('ERRO: Não foi possível criar a tabela');
                throw err;
            }
});

// Cadastra o log
app.post('/logging/', (req, res, next) => {
    db.run(`INSERT INTO logging (evento, status, descricao, horario) VALUES (?,?,?,?)`,
        [req.body.evento, req.body.status, req.body.descricao, new Date().toString()], (err) => {
            if (err) {
                console.log('Erro: ', err);
                res.status(500).send('Erro ao cadastrar log');
            } else {
                console.log('Log cadastrado com sucesso!');
                res.status(200).send('Log cadastrado com sucesso!');
            }
        });
});

// Consulta todos os dados da tabela
app.get('/logging/', (req, res, next) => {
    db.all(`SELECT * FROM logging`, [], (err, result) => {
        if (err) {
            console.log('Erro: ', err);
            res.status(500).send('Erro ao obter dados');
        } else {
            res.status(200).json(result);
        }
    });
});


let porta = 8070;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});