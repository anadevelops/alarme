const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function log(evento, status, descricao) {
    fetch('http://localhost:8070/logging', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            evento, status, descricao, horario: new Date().toString()
        })
    });
};

// Aciona o alarme
app.post('/acionar/liga', (req, res, next) => {
    log('Acionamento', 'OK', 'Alarme ligado com sucesso');
    console.log('Alarme ligado com sucesso')
});



// Desliga o alarme o alarme
app.post('/aciona/desliga', (req, res, next) => {
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