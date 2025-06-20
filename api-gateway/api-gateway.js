const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');

app.use(logger('dev'));

//----------------------------------------------------------------
// Proxy
//----------------------------------------------------------------

// Create proxy
function selectProxyHost(req) {
    if (req.path.startsWith('/usuario'))
        return 'http://localhost:8080/';
    else if (req.path.startsWith('/alarme'))
        return 'http://localhost:8090/';
    else if (req.path.startsWith('/dispara'))
        return 'http://localhost:8050/';
    else if (req.path.startsWith('/aciona'))
        return 'http://localhost:8060';
    else return null;
}


// Use proxy
app.use((req, res, next) => {
    var proxyHost = selectProxyHost(req);
    if (proxyHost == null)
        res.status(404).send('Not found');
    else
        httpProxy(proxyHost)(req, res, next);
});


//----------------------------------------------------------------
// Server
//----------------------------------------------------------------

// Listen
app.listen(8000, () => {
    console.log('API Gateway iniciado!');
});


//----------------------------------------------------------------