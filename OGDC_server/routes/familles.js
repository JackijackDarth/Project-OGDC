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

module.exports = famillesRoutes;
