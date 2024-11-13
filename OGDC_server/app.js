const express = require('express');
const http = require("http");
const bodyParser = require('body-parser');
const config = require('./config');

const connexionRoutes = require('./routes/connexion');
const creerUtilisateurRoutes = require('./routes/creerUtilisateur');
const robotRoutes = require('./routes/robotConnecter');
const objetRoutes = require('./routes/listeObjets');
const deconnexionRoutes = require('./routes/deconnexion');
const commandesRoutes = require('./routes/commandes');
const famillesRoutes = require('./routes/familles');
const notesRoutes = require('./routes/notes')
const automatisationsRoutes = require('./routes/automatisations');

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

app.use('/ogdc/creationUtilisateur',creerUtilisateurRoutes);
app.use('/ogdc/authentification', connexionRoutes);
app.use('/ogdc/connexion/',connexionRoutes);
app.use('/ogdc/robot_connecter', robotRoutes);
app.use('/ogdc/liste_objets', objetRoutes);
app.use('/ogdc/deconnexion',deconnexionRoutes);
app.use('/ogdc/commandes',commandesRoutes);
app.use('/ogdc/familles/',famillesRoutes);
app.use('/ogdc/notes/',notesRoutes);
app.use('/ogdc/automatisation',automatisationsRoutes)

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Écoute sur http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    console.log("Arrêt du serveur");
    process.exit();
});