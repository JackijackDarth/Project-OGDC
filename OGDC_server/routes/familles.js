const { Router } = require('express');
const familles = require('../familles');

const famillesRoutes = Router();


famillesRoutes.route('/')
    .get((req,res)=>{
       
    })
    .post((req, res) => {
        console.log("Création groupe famille ");
        let resultat = familles.CreerFamille(req.body);
        console.log(resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    })

famillesRoutes.route('/:param1')
    .post((req, res) => {
        
    })
    .get((req,res)=>{
        console.log("Obtenir les membres de la famille ",req.params.param1);
        const resultat = familles.ObtenirMembreFamille(req.params.param1);
        console.log("Résultat de obtenirMembreFamille:", resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.json(resultat.famille);
        }
    })
    .put((req, res) => {
        console.log("Ajouter à la famille le user # ",req.params.param1);
        let resultat = familles.AjouterUserAFamille(req.params.param1,req.body);
        console.log(resultat);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201).send(resultat);
        }
    })

module.exports = famillesRoutes;
