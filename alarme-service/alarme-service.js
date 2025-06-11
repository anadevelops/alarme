const express = require(`express`);
const bodyParser = require(`body-parser`);
const sqlite3 = require(`sqlite3`);
const { getUsuario, getAlarme } = require(`../helpers`)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//----------------------------------------------------------------
// Criação/Carregamento Base de Dados
//----------------------------------------------------------------

// Criar DB
var db = new sqlite3.Database(`./alarmes.db`, (err) => {
    if (err) {
        console.log(`ERRO: não foi possível conectar ao SQLite.`);
        throw err;
    }
    console.log(`Conectado ao SQLite.`);
});

// Cria a tabela
db.run(`CREATE TABLE IF NOT EXISTS alarmes
        (id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
         local TEXT NOT NULL,
         usuarios TEXT NOT NULL, 
         monitora TEXT NOT NULL)`,
         [], (err) => {
            if (err) {
                console.log(`ERRO: Não foi possível criar a tabela`);
                throw err;
            }
});

//----------------------------------------------------------------
// Helpers
//----------------------------------------------------------------

async function validaDadosAlarme(data) {
    // Parametro usuários é ARRAY
    if (!Array.isArray(data.usuarios)) return {
        success: false,
        message: `Parâmetro 'usuarios' deve ser do tipo array`
    }

    // Usuários do ARRAY existem
    for (const cpf of data.usuarios) {
        if (!await getUsuario(cpf)) return {
            success: false,
            message: `Um ou mais usuários cadastrados não existem`
        }
    }

    // Existe pelo menos um usuário
    if (data.usuarios.length == 0) return {
        success: false,
        message: `Pelo menos um usuário deve ser atribuido a um alarme`
    }

    return { success: true }
}

async function authorizeUser(idAlarme, cpf) {
    const alarme = await getAlarme(idAlarme);
    if (!alarme) return {
        success: false,
        message: `ID inválido`
    }

    // Não tem permissão
    if (!alarme.usuarios.includes(cpf)) return {
        success: false,
        message: `Permissão negada`
    }

    return {
        success: true,
    }
}


//----------------------------------------------------------------
// Routes
//----------------------------------------------------------------

// Cadastra o alarme
app.post(`/alarme/`, async (req, res, next) => {
    // Valida se alarme com mesmo ID já não existe
    if (await getAlarme(req.body.id)) {res.status(500).send(`Erro ao cadastrar alarme: ID em uso`); return}

    // Validar dados
    const validation = await validaDadosAlarme(req.body)
    if (!validation.success) { res.status(500).send(validation.message); return }

    // Adicionar ao banco
    db.run(`INSERT INTO alarmes(id, local, usuarios, monitora) VALUES (?,?,?,?)`,
        [req.body.id, req.body.local, req.body.usuarios.join(`, `), req.body.monitora], (err) => {
            if (err) {
                res.status(500).send(`Erro ao cadastrar alarme: ${err}`);
            } else {
                res.status(200).send(`Alarme cadastrado com sucesso!`);
            }
        });
});

// Consulta todos os dados da tabela
app.get(`/alarme/`, (req, res, next) => {
    db.all(`SELECT * FROM alarmes`, [], (err, rows) => {
        if (err) {
            res.status(500).send(`Erro ao obter dados: ${err}`);
        } else {
            // Converte a string de usuários em array para cada registro
            const result = rows.map(row => ({
                ...row,
                usuarios: row.usuarios ? row.usuarios.split(`, `).map(u => u.trim()) : []
            }));

            res.status(200).json(result);
        }
    });
});

// Consulta um alarme específico através do ID
app.get(`/alarme/:id`, (req, res, next) => {
    db.get(`SELECT * FROM alarmes WHERE id = ?`,
        req.params.id, (err, result) => {
            if (err) {
                res.status(500).send(`Erro ao obter dados: ${err}`);
            } else if (result == null) {
                res.status(404).send(`Alarme não encontrado`);
            } else {
                result.usuarios = result.usuarios.split(`, `)
                res.status(200).json(result);
            }
        });
});

// Atualiza alarme
app.patch(`/alarme/:id`, async (req, res, next) => {
    // Valida permissao
    const authorize = await authorizeUser(req.params.id, req.body.cpf)
    if (!authorize.success) { res.status(500).send(authorize.message); return }

    // Validar dados
    const validation = await validaDadosAlarme(req.body)
    if (!validation.success) { res.status(500).send(validation.message); return }

    // Atualiza no BD
    db.run(`UPDATE alarmes SET local = COALESCE(?, local), usuarios = COALESCE(?, usuarios), monitora = COALESCE(?, usuarios) WHERE id = ?`,
        [req.body.local, req.body.usuarios.join(`, `), req.body.monitora, req.params.id], function(err) {
            if (err) {
                res.status(500).send(`Erro ao alterar dados: ${err}`);
            } else if (this.changes == 0) {
                res.status(404).send(`Alarme não encontrado`);
            } else {
                res.status(200).send(`Alarme alterado com sucesso!`);
            }
        });
});

// Exclui o alarme
app.delete(`/alarme/:id`, async (req, res, next) => {
    // Valida permissao
    const authorize = await authorizeUser(req.params.id, req.body.cpf)
    if (!authorize.success) { res.status(500).send(authorize.message); return }

    // Atualiza no BD
    db.run(`DELETE FROM alarmes WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            res.status(500).send(`Erro ao excluir alarme: ${err}`);
        } else if (this.changes == 0) {
            res.status(404).send(`Alarme não encontrado.`);
        } else {
            res.status(200).send(`Alarme excluído com sucesso!`);
        }
    });
});


//----------------------------------------------------------------
// Server
//----------------------------------------------------------------

// Listen
let porta = 8090;
app.listen(porta, () => {
    console.clear()
    console.log("Alarme Service")
    console.log(`Servidor em execução na porta: ` + porta);
});

//----------------------------------------------------------------