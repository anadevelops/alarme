const express = require('express');
const bodyParser = require('body-parser');
const { registerLog, sendNotification, getAlarme, getUsuario } = require("../helpers")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//----------------------------------------------------------------
// Helpers
//----------------------------------------------------------------

// Valida permissionamento e existencia
function validateAlarmAndUser({alarme, usuario, cpf}) {
    // Alarme não existe
    if (!alarme) return {
        success: false,
        message: 'ID de alarme inválido',
    }
    const identificacaoAlarme = `Alarme ${alarme.monitora} em ${alarme.local}`
    
    // Usuário não existe
    if (!usuario) {
        const CPFText = cpf ? ` (CPF: ${cpf})` : ""
        registerLog('Acionamento', 'Error', `Tentativa de ligar ${identificacaoAlarme} por usuario não identificado${CPFText}`)
        return {
            sucess: false,
            message: `Permissão Insuficiente`
        }
    }
    const identificacaoUsuario = `${usuario.nome} (CPF: ${usuario.cpf})`
    

    // Usuário sem permissão
    if (!alarme.usuarios.includes(String(cpf))) {
        registerLog('Acionamento', 'Error', `Tentativa de ligar ${identificacaoAlarme} por usuario não autorizado ${identificacaoUsuario}`);
        return {
            sucess: false,
            message: `Permissão Insuficiente`
        }
    }

    return {
        success: true,
        identificacaoAlarme,
        identificacaoUsuario
    }
}


//----------------------------------------------------------------
// API Routes
//----------------------------------------------------------------

// Liga o alarme
app.post('/aciona/liga/:id', async (req, res, next) => {
    const cpf = req.body.cpf
    const alarme = await getAlarme(req.params.id);
    const usuario = await getUsuario(cpf)

    // Validações
    const validate = validateAlarmAndUser({alarme, usuario, cpf})
    if (!validate.success) {res.status(500).send(validate.message); return}
    const { identificacaoAlarme, identificacaoUsuario } = validate

    // Registros
    const msg = `${identificacaoAlarme} ligado com sucesso por ${identificacaoUsuario}.`
    sendNotification(msg, alarme.usuarios)
    registerLog('Acionamento', 'OK', msg);

    res.status(200).send(`${identificacaoAlarme} ligado com sucesso!`);
});

// Desliga o alarme
app.post('/aciona/desliga/:id', async (req, res, next) => {
    const cpf = req.body.cpf
    const alarme = await getAlarme(req.params.id);
    const usuario = await getUsuario(cpf)

    // Validações
    const validate = validateAlarmAndUser({alarme, usuario, cpf})
    if (!validate.success) {res.status(500).send(validate.message); return}
    const { identificacaoAlarme, identificacaoUsuario } = validate

    // Registros
    const msg = `${identificacaoAlarme} desligado com sucesso por ${identificacaoUsuario}.`
    sendNotification(msg, alarme.usuarios)
    registerLog('Acionamento', 'OK', msg);

    res.status(200).send(`${identificacaoAlarme} desligado com sucesso!`);
});


//----------------------------------------------------------------
// Server
//----------------------------------------------------------------

// Listen
let porta = 8060;
app.listen(porta, () => {
    console.clear()
    console.log(`Acionamento Service`)
    console.log('Servidor em execução na porta: ' + porta);
});


//----------------------------------------------------------------