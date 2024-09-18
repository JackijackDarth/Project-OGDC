const express = require('express');
const http = require("http");
const bodyParser = require('body-parser');
const config = require('./config');

const menu = require('./routes/menu');
//const commandeRoutes = require('./routes/commande');
const connexionRoutes = require('./routes/connexion');
const creerUtilisateurRoutes = require('./routes/creerUtilisateur');

const connexion = require('./verifierConnexion');

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
app.use(connexion.connecter); // Premièrement authentifier l'usager
app.use('/cafehomer/menu', menu.menuRoutes);
//app.use('/cafehomer/commandes', commandeRoutes);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Écoute sur http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    console.log("Arrêt du serveur");
    process.exit();
});