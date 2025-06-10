const express = require('express');
const bodyParser = require('body-parser');
const { registerLog, getAlarme } = require("../helpers")

console.clear()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Aciona o alarme
app.post('/aciona/liga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
    }

    if (dadosAlarme.usuarios.includes(req.body.cpf)) {
        registerLog('Acionamento', 'OK', `${dadosAlarme.local} ligado com sucesso`);
        res.status(200).send(`${dadosAlarme.local} ligado com sucesso`);
    }
    else {
        registerLog('Acionamento', 'Error', `${dadosAlarme.local} tentativa de ligação por usuário não autorizado`);
        res.status(500).send('Usuário não possui permissão para manipular esse alarme!');
    }
});

// Desliga o alarme o alarme
app.post('/aciona/desliga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
    }

    if (dadosAlarme.usuarios.includes(req.body.cpf)) {
        registerLog('Desligamento', 'OK', `${dadosAlarme.local} desligado com sucesso`);
        res.status(200).send(`${dadosAlarme.local} desligado com sucesso`);
    }
    else {
        registerLog('Desligamento', 'Error', `${dadosAlarme.local} tentativa de desligamento por usuário não autorizado`);
        res.status(500).send('Usuário não possui permissão para manipular esse alarme!');
    }
});

let porta = 8060;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});