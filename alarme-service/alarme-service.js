const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.clear()

var db = new sqlite3.Database('./alarmes.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível conectar ao SQLite.');
        throw err;
    }
    console.log('Conectado ao SQLite.');
});

// Cria a tabela 
db.run(`CREATE TABLE IF NOT EXISTS alarmes
        (id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
         local TEXT NOT NULL,
         usuarios TEXT NOT NULL, 
         monitora TEXT NOT NULL)`,
         [], (err) => {
            if (err) {
                console.log('ERRO: Não foi possível criar a tabela');
                throw err;
            }
});

// Cadastra o alarme
app.post('/alarme/', (req, res, next) => {
    db.run(`INSERT INTO alarmes(id, local, usuarios, monitora) VALUES (?,?,?,?)`,
        [req.body.id, req.body.local, req.body.usuarios, req.body.monitora], (err) => {
            if (err) {
                console.log('Erro: ', err);
                res.status(500).send('Erro ao cadastrar alarme');
            } else {
                console.log('Alarme cadastrado com sucesso!');
                res.status(200).send('Alarme cadastrado com sucesso!');
            }
        });
});

// Consulta todos os dados da tabela
app.get('/alarme/', (req, res, next) => {
    db.all(`SELECT * FROM alarmes`, [], (err, result) => {
        if (err) {
            console.log('Erro: ', err);
            res.status(500).send('Erro ao obter dados');
        } else {
            res.status(200).json(result);
        }
    });
});

// Consulta um alarme específico através do ID
app.get('/alarme/:id', (req, res, next) => {
    db.get(`SELECT * FROM alarmes WHERE id = ?`,
        req.params.id, (err, result) => {
            if (err) {
                console.log('Erro: ', err);
                res.status(500).send('Erro ao obter dados.');
            } else if (result == null) {
                console.log('Alarme não encontrado');
                res.status(404).send('Alarme não encontrado');
            } else {
                res.status(200).json(result);
            }
        });
});

// Altera cadastro do alarme
app.patch('/alarme/:id', (req, res, next) => {
    db.run(`UPDATE alarmes SET local = COALESCE(?, local), usuarios = COALESCE(?, usuarios), monitora = COALESCE(?, usuarios) WHERE id = ?`,
        [req.body.local, req.body.usuarios, req.body.monitora, req.params.id], function(err) {
            if (err) {
                res.status(500).send('Erro ao alterar dados');
            } else if (this.changes == 0) {
                console.log('Alarme não encontrado');
                res.status(404).send('Alarme não encontrado');
            } else {
                res.status(200).send('Alarme alterado com sucesso!');
            }
        });
});

// Exclui o alarme
app.delete('/alarme/:id', (req, res, next) => {
    db.run(`DELETE FROM alarmes WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            res.status(500).send('Erro ao excluir alarme');
        } else if (this.changes == 0) {
            console.log('Alarme não encontrado.');
            res.status(404).send('Alarme não encontrado.');
        } else {
            res.status(200).send('Alarme excluído com sucesso!');
        }
    });
});

let porta = 8090;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});