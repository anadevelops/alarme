
module.exports = function (evento, status, descricao) {
    fetch('http://localhost:8070/logging', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            evento, status, descricao
        })
    });
}