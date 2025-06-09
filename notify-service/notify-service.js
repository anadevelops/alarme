const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.clear()

// Exibe notificação
app.post('/notify/', (req, res, next) => {
    try {
        const { message, time, usuarios } = req.body
        for (const usuario of usuarios.split(",")) {
            console.log(`[${time} - ${usuario}] ${message}`)
        }

        // Resposta
        const msg = "Notificações enviadas com sucesso!"
        console.log(msg)
        res.status(200).send(msg)
    }
    catch (error) {
        // Resposta
        console.log(error)
        res.status(500).send(error)
    }
});


let porta = 8040;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});