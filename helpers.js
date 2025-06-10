

// Registra um novo log
async function registerLog (evento, status, descricao) {
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

// Retorna um Alarme com o ID especificado
async function getAlarme(id) {
    try {
        const response = await fetch(`http://localhost:8090/alarme/${id}`);
        const data = await response.json();
        return data;
    } catch {
        return null;
    }
};

module.exports = { registerLog, getAlarme }