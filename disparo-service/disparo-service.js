const express = require('express');
const bodyParser = require('body-parser');
const { getAlarme, registerLog, sendNotification } = require("../helpers")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//----------------------------------------------------------------
// Routes
//----------------------------------------------------------------

// Dispara o alarme
app.post('/dispara/:id', async (req, res, next) => {
    console.log(`POST request on /dispara`)

    const dadosAlarme = await getAlarme(req.params.id);
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
    };

    // Mensagem
    const msg = `Alarme ${dadosAlarme.monitora} disparado em ${dadosAlarme.local}!`
    sendNotification(msg, dadosAlarme.usuarios)
    registerLog('Disparo', 'OK', msg);
    res.status(200).send(msg)
});


//----------------------------------------------------------------
// Server
//----------------------------------------------------------------

// Listen
let porta = 8050;
app.listen(porta, () => {
    console.clear()
    console.log("Disparo Service")
    console.log(`Servidor em execução na porta: ${porta}\n`);
});


//----------------------------------------------------------------