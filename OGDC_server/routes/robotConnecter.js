const listeRobots = require('../listeRobot');

const { Router } = require('express');

const robot_Connecter = Router();

robot_Connecter.route('/')
    .post((req, res) => {
        console.log("Créer un robot");
        const robotInfo = req.body;
        console.table(robotInfo);
        const resultat = listeRobots.créerRobot(robotInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })
    .get(async (req, res) => {
        console.log("Obtenir toutes les robots");
        res.json(listeRobots.obtenirRobots());
    })
robot_Connecter.route('/:id')
    .post((req, res) => {
        console.log("Connexions robots");
        const connexionInfo = req.body;
        const resultat = listeRobots.connexionRobots(connexionInfo);
        if (resultat.erreur !== 0) {
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })

module.exports = robot_Connecter;
    