async function log (evento, status, descricao) {
    try {
        await fetch('http://localhost:8070/logging', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                evento, status, descricao
            })
        });
    } catch {
        console.log("Falha ao registrar o logging da atividade.")
    }
}

module.exports = log