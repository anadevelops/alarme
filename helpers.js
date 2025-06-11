

//----------------------------------------------------------------
// Logging and Notifications
//----------------------------------------------------------------

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

// Envia notificações a usuários
async function sendNotification (message, usuarios) {
    try {
        await fetch('http://localhost:8040/notify', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                message, usuarios
            })
        });
    } catch {
        console.log("Falha ao enviar notificações.")
    }
}


//----------------------------------------------------------------
// Getters
//----------------------------------------------------------------

// Retorna um Alarme com o ID especificado
async function getAlarme(id) {
    try {
        const response = await fetch(`http://localhost:8000/alarme/${id}`);
        const data = await response.json();
        return data;
    } catch {
        return null;
    }
};

// Retorna um usuário com o CPF especificado
async function getUsuario(cpf) {
    try {
        const response = await fetch(`http://localhost:8000/usuario/${cpf}`);
        const data = await response.json();
        return data;
    } catch {
        return null;
    }
};

//----------------------------------------------------------------
// Export
//----------------------------------------------------------------

module.exports = { registerLog, sendNotification, getAlarme, getUsuario }


//----------------------------------------------------------------