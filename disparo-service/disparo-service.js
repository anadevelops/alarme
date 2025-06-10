const express = require('express');
const bodyParser = require('body-parser');
const { getAlarme, registerLog } = require("../helpers")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Dispara o alarme
app.post('/dispara/:id', async (req, res, next) => {
    const localAlarme = await getAlarme(req.params.id);
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
    };

    registerLog('Disparo', 'OK', `${localAlarme} disparado!!`);
    res.status(200).send(`${localAlarme} disparado!!`)
});


// Listen
let porta = 8050;
app.listen(porta, () => {
    console.clear()
    console.log("Disparo Service")
    console.log('Servidor em execução na porta: ' + porta);
});