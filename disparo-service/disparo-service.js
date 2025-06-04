const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function log(evento, status, descricao) {
    fetch('http://localhost:8070/logging', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            evento, status, descricao, horario: new Date().toString()
        })
    });
};

async function getAlarmeLocal(id) {
    const response = await fetch(`http://localhost:8090/alarme/consultar/${id}`);
    const data = await response.json();
    return data.local;
};

// Dispara o alarme
app.post('/dispara/liga/:id', async (req, res, next) => {
    const localAlarme = await getAlarmeLocal(req.params.id);
    log('Acionamento', 'OK', `${localAlarme} disparado!!`);
    console.log(`${localAlarme} disparado!!`)
});

let porta = 8050;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});