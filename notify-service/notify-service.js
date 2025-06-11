const express = require('express');
const bodyParser = require('body-parser');
const { getUsuario } = require('../helpers')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//----------------------------------------------------------------
// Routes
//----------------------------------------------------------------

// Envia notificação
app.post('/notify/', async (req, res, next) => {
    try {
        // Dados
        const horario = new Date().toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour12: false
        })
        const { message, usuarios } = req.body

        // Envio
        for (const cpf of usuarios) {
            const usuario = await getUsuario(cpf)
            if (!usuario) continue

            const identificacaoUsuario = `${usuario.nome} (CPF: ${usuario.cpf})`
            console.log(`[${horario}] sent notification to ${identificacaoUsuario}: ${message}`)
        }

        // Resposta
        res.status(200).send(`Notificações enviadas com sucesso`)
    }
    catch (error) {
        // Resposta
        res.status(500).send(`Erro ao enviar notificações: ${error}`)
    }
});


//----------------------------------------------------------------
// Server
//----------------------------------------------------------------

// Listen
let porta = 8040;
app.listen(porta, () => {
    console.clear()
    console.log("Notify Service")
    console.log('Servidor em execução na porta: ' + porta + '\n');
});


//----------------------------------------------------------------