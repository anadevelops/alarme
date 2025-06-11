const express = require('express');
const bodyParser = require('body-parser');
const { registerLog, sendNotification, getAlarme, getUsuario } = require("../helpers")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Liga o alarme
app.post('/aciona/liga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    const usuarioAtual = await getUsuario(req.body.cpf)

    // Alarme não existe
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
        return
    }
    const identificacaoAlarme = `Alarme ${dadosAlarme.monitora} em ${dadosAlarme.local}`

    // Usuário não existe
    if (!usuarioAtual) {
        const CPFText = req.body.cpf ? ` (CPF: ${req.body.cpf})` : ""
        registerLog('Acionamento', 'Error', `Tentativa de ligar ${identificacaoAlarme} por usuario não identificado${CPFText}`)
        res.status(500).send('Permissão insuficiente!');
        return
    }
    const identificacaoUsuario = `${usuarioAtual.nome} (CPF: ${usuarioAtual.cpf})`

    // Usuário sem permissão
    if (!dadosAlarme.usuarios.includes(req.body.cpf)) {
        registerLog('Acionamento', 'Error', `Tentativa de ligar ${identificacaoAlarme} por usuario não autorizado ${identificacaoUsuario}`);
        res.status(500).send('Permissão insuficiente!');
        return
    }

    // Registros
    const msg = `${identificacaoAlarme} ligado com sucesso por ${identificacaoUsuario}.`
    sendNotification(msg, dadosAlarme.usuarios)
    registerLog('Acionamento', 'OK', msg);

    res.status(200).send(`${identificacaoAlarme} ligado com sucesso!`);
});

// Desliga o alarme
app.post('/aciona/desliga/:id', async (req, res, next) => {
    const dadosAlarme = await getAlarme(req.params.id);
    const usuarioAtual = await getUsuario(req.body.cpf)

    // Alarme não existe
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
        return
    }
    const identificacaoAlarme = `Alarme ${dadosAlarme.monitora} em ${dadosAlarme.local}`

    // Usuário não existe
    if (!usuarioAtual) {
        const CPFText = req.body.cpf ? ` (CPF: ${req.body.cpf})` : ""
        registerLog('Acionamento', 'Error', `Tentativa de desligar ${identificacaoAlarme} por usuario não identificado${CPFText}`)
        res.status(500).send('Permissão insuficiente!');
        return
    }
    const identificacaoUsuario = `${usuarioAtual.nome} (CPF: ${usuarioAtual.cpf})`

    // Usuário sem permissão
    if (!dadosAlarme.usuarios.includes(req.body.cpf)) {
        registerLog('Acionamento', 'Error', `Tentativa de desligar ${identificacaoAlarme} por usuario não autorizado ${identificacaoUsuario}`);
        res.status(500).send('Permissão insuficiente!');
        return
    }

    // Registros
    const msg = `${identificacaoAlarme} desligado com sucesso por ${identificacaoUsuario}.`
    sendNotification(msg, dadosAlarme.usuarios)
    registerLog('Acionamento', 'OK', msg);

    res.status(200).send(`${identificacaoAlarme} desligado com sucesso!`);
});

// Listen
let porta = 8060;
app.listen(porta, () => {
    console.clear()
    console.log(`Acionamento Service`)
    console.log('Servidor em execução na porta: ' + porta);
});