const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
         usuarios INTEGER NOT NULL, 
         monitora TEXT NOT NULL,
         FOREIGN KEY (usuarios) REFERENCES usuarios(cpf)`,
         [], (err) => {
            if (err) {
                console.log('ERRO: Não foi possível criar a tabela');
                throw err;
            }
});

// Cadastra o alarme
app.post('/cadastro_alarme', (req, res, next) => {
    db.run(`INSERT INTO alarmes(id, local, cpf) VALUES (?,?,?)`,
        [res.body.nome, req.body.telefone, req.body.cpf], (err) => {
            if (err) {
                console.log('Erro: ', err);
                res.status(500).send('Erro ao cadastrar usuário');
            } else {
                console.log('Usuário cadastrado com sucesso!');
                res.status(200).send('Cliente cadastrado com sucesso!');
            }
        });
});

// Consulta todos os dados da tabela
app.get('/consulta_usuario', (req, res, next) => {
    db.all(`SELECT * FROM usuarios`, [], (err, result) => {
        if (err) {
            console.log('Erro: ', err);
            res.status(500).send('Erro ao obter dados');
        } else {
            res.status(200).json(result);
        }
    });
});

// Consulta um usuário específico através do CPF
app.get('/consulta_usuario/:cpf', (req, res, next) => {
    db.get(`SELECT * FROM usuarios WHERE cpf = ?`,
        req.params.cpf, (err, result) => {
            if (err) {
                console.log('Erro: ', err);
                res.status(500).send('Erro ao obter dados.');
            } else if (result == null) {
                console.log('Usuário não encontrado');
                res.status(404).send('Usuário não encontrado');
            } else {
                res.status(200).json(result);
            }
        });
});

// Altera cadastro do usuário
app.patch('/altera_usuario/:cpf', (req, res, next) => {
    db.run(`UPDATE usuarios SET nome = COALESCE(?, nome), telefone = COALESCE(?, telefone) WHERE cpf = ?`,
        [req.body.nome, req.body.telefone, req.params.cpf], function(err) {
            if (err) {
                res.status(500).send('Erro ao alterar dados');
            } else if (this.changes == 0) {
                console.log('Usuário não encontrado');
                res.status(404).send('Usuário não encontrado');
            } else {
                res.status(200).send('Usuário alterado com sucesso!');
            }
        });
});

// Exclui o usuário
app.delete('/exclui_usuario/:cpf', (req, res, next) => {
    db.run(`DELETE FROM usuarios WHERE cpf = ?`, req.params.cpf, function(err) {
        if (err) {
            res.status(500).send('Erro ao excluir usuário');
        } else if (this.changes == 0) {
            console.log('Usuário não encontrado.');
            res.status(404).send('Usuário não encontrado.');
        } else {
            res.status(200).send('Usuário excluído com sucesso!');
        }
    });
});

let porta = 8080;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});