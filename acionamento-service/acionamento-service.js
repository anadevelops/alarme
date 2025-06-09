const express = require('express');
const bodyParser = require('body-parser');
const log = require("../logging-service/log")

console.clear()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

async function getAlarme(id) {
    try {
        const response = await fetch(`http://localhost:8090/alarme/${id}`);
        const data = await response.json();
        return data;
    } catch {
        return false;
    }
};

// Aciona o alarme
app.post('/aciona/liga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
    }

    if (dadosAlarme.usuarios.includes(req.body.cpf)) {
        log('Acionamento', 'OK', `${dadosAlarme.local} ligado com sucesso`);
        console.log(`${dadosAlarme.local} ligado com sucesso`);
    }
    else {
        log('Acionamento', 'Error', `${dadosAlarme.local} tentativa de ligação por usuário não autorizado`);
        console.log('Usuário não possui permissão para manipular esse alarme!');
    }
});

// Desliga o alarme o alarme
app.post('/aciona/desliga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
    }

    if (dadosAlarme.usuarios.includes(req.body.cpf)) {
        log('Desligamento', 'OK', `${dadosAlarme.local} desligado com sucesso`);
        console.log(`${dadosAlarme.local} desligado com sucesso`);
    }
    else {
        log('Desligamento', 'Error', `${dadosAlarme.local} tentativa de desligamento por usuário não autorizado`);
        console.log('Usuário não possui permissão para manipular esse alarme!');
    }
});

let porta = 8060;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});