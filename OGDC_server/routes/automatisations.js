const { Router } = require('express');
const automatisations = require('../automatisations');

const automatisationsRoutes = Router();


automatisationsRoutes.route('/')
    .post((req, res) => {
        console.log("Création automatisation -----------------------------------------------------");
        const resultat = automatisations.EnvoyerAutomatisation(req.body);
        console.log('Résultat: ',resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201);
        }
    });

automatisationsRoutes.route('/:param1')
    .delete((req,res)=>{
        console.log("Automatisation delete : ", req.params.param1 + " ------------------------------------------------");
        let resultat = automatisations.SupprimerAutomatisation(req.params.param1);
        console.log(resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    })
    .get((req,res)=>{
        console.log("Obtenir les automatisations pour le user : ",req.params.param1 + " ------------------------------------------");
        const resultat = automatisations.ObtenirAutomatisationUser(req.params.param1);
        console.log("Résultat de ObtenirAutomatisationUser:", resultat);
        
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.notes);
        }
    })

module.exports = automatisationsRoutes;
