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

async function getAlarme(id) {
    const response = await fetch(`http://localhost:8090/alarme/consultar/${id}`);
    const data = await response.json();
    return data;
};

// Aciona o alarme
app.post('/aciona/liga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    if (req.body.cpf in dadosAlarme.usuario)
        log('Acionamento', 'OK', `${dadosAlarme.local} ligado com sucesso`);
        console.log(`${dadosAlarme.local} ligado com sucesso`);
    console.log('Usuário não possui permissão para manipular esse alarme!');
});

// Desliga o alarme o alarme
app.post('/aciona/desliga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    if (req.bpdy.cpf in dadosAlarme.usuario)
        log('Acionamento', 'OK', `${dadosAlarme.local} desligado com sucesso`);
        console.log(`${dadosAlarme.local} desligado com sucesso`);
    console.log('Usuário não possui permissão para manipular esse alarme!');
});

let porta = 8060;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});