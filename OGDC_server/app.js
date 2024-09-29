const express = require('express');
const http = require("http");
const bodyParser = require('body-parser');
const config = require('./config');

const connexionRoutes = require('./routes/connexion');
const creerUtilisateurRoutes = require('./routes/creerUtilisateur');
const robotRoutes = require('./routes/robotConnecter');
const objetRoutes = require('./routes/listeObjets');

const app = express();
const { port } = config;

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Accessing ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'Bonjour, Hi' });
});

app.use('/cafehomer/creationUtilisateur',creerUtilisateurRoutes)
app.use('/cafehomer/authentification', connexionRoutes);
app.use('/cafehomer/connexion/',connexionRoutes)
app.use('/cafehomer/robot_connecter', robotRoutes)
app.use('/cafehomer/liste_objets', objetRoutes)

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Écoute sur http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    console.log("Arrêt du serveur");
    process.exit();
});