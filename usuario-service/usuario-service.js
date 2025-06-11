const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//----------------------------------------------------------------
// Criação/Carregamento Base de Dados
//----------------------------------------------------------------

// Start DB
var db = new sqlite3.Database('./usuarios.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível conectar ao SQLite.');
        throw err;
    }
    console.log('Conectado ao SQLite.');
});

// Cria a tabela 
db.run(`CREATE TABLE IF NOT EXISTS usuarios
        (nome TEXT NOT NULL, 
         telefone INTEGER NOT NULL,
         cpf INTEGER PRIMARY KEY NOT NULL UNIQUE)`,
         [], (err) => {
            if (err) {
                console.log('ERRO: Não foi possível criar a tabela');
                throw err;
            }
});


//----------------------------------------------------------------
// Routes
//----------------------------------------------------------------

// Cadastra o usuário
app.post('/usuario/', (req, res, next) => {
    db.run(`INSERT INTO usuarios(nome, telefone, cpf) VALUES (?,?,?)`,
        [req.body.nome, req.body.telefone, req.body.cpf], (err) => {
            if (err) {
                res.status(500).send(`Erro ao cadastrar usuário: ${err}`);
            } else {
                res.status(200).send('Usuário cadastrado com sucesso!');
            }
        });
});

// Consulta todos os dados da tabela
app.get('/usuario/', (req, res, next) => {
    db.all(`SELECT * FROM usuarios`, [], (err, result) => {
        if (err) {
            res.status(500).send(`Erro ao obter dados: ${err}`);
        } else {
            res.status(200).json(result);
        }
    });
});

// Consulta um usuário específico através do CPF
app.get('/usuario/:cpf', (req, res, next) => {
    db.get(`SELECT * FROM usuarios WHERE cpf = ?`,
        req.params.cpf, (err, result) => {
            if (err) {
                res.status(500).send(`Erro ao obter dados: ${err}`);
            } else if (result == null) {
                res.status(404).send('Usuário não encontrado');
            } else {
                res.status(200).json(result);
            }
        });
});

// Altera cadastro do usuário
app.patch('/usuario/:cpf', (req, res, next) => {
    db.run(`UPDATE usuarios SET nome = COALESCE(?, nome), telefone = COALESCE(?, telefone) WHERE cpf = ?`,
        [req.body.nome, req.body.telefone, req.params.cpf], function(err) {
            if (err) {
                res.status(500).send(`Erro ao alterar dados: ${err}`);
            } else if (this.changes == 0) {
                res.status(404).send('Usuário não encontrado');
            } else {
                res.status(200).send('Usuário alterado com sucesso!');
            }
        });
});

// Exclui o usuário
app.delete('/usuario/:cpf', (req, res, next) => {
    db.run(`DELETE FROM usuarios WHERE cpf = ?`, req.params.cpf, function(err) {
        if (err) {
            res.status(500).send(`Erro ao excluir usuário: ${err}`);
        } else if (this.changes == 0) {
            res.status(404).send('Usuário não encontrado.');
        } else {
            res.status(200).send('Usuário excluído com sucesso!');
        }
    });
});


//----------------------------------------------------------------
// Server
//----------------------------------------------------------------

// Listen
let porta = 8080;
app.listen(porta, () => {
    console.clear()
    console.log("Usuario Service")
    console.log('Servidor em execução na porta: ' + porta);
});


//----------------------------------------------------------------