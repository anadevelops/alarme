const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Envia notificação
app.post('/notify/', (req, res, next) => {
    try {
        const { message, usuarios } = req.body
        for (const usuario of usuarios) {
            console.log(`[${new Date().toString()} - ${usuario}] ${message}`)
        }

        // Resposta
        res.status(200).send(`Notificações enviadas com sucesso`)
    }
    catch (error) {
        // Resposta
        res.status(500).send(`Erro ao enviar notificações: ${error}`)
    }
});


// Listen
let porta = 8040;
app.listen(porta, () => {
    console.clear()
    console.log("Notify Service")
    console.log('Servidor em execução na porta: ' + porta);
});