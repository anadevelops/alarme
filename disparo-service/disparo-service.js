const express = require('express');
const bodyParser = require('body-parser');
const log = require("../logging-service/log")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.clear()

async function getAlarme(id) {
    try {
        const response = await fetch(`http://localhost:8090/alarme/${id}`);
        const data = await response.json();
        return data;
    } catch {
        return false;
    }
};

// Dispara o alarme
app.post('/dispara/:id', async (req, res, next) => {
    const localAlarme = await getAlarmeLocal(req.params.id);
    if (!dadosAlarme) {
        res.status(500).send('ID de alarme inválido');
    };

    log('Disparo', 'OK', `${localAlarme} disparado!!`);
    console.log(`${localAlarme} disparado!!`)
});

let porta = 8050;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});