const fs = require('fs');
const user = require('../users');


const { Router } = require('express');

const creationRoute = Router();

creationRoute.route('/')
    .post((req, res) => {
        console.log("Créer un usager");
        const usagerInfo = req.body;
        console.table(usagerInfo);
        const resultat = user.créerUtilisateur(usagerInfo);
        if (resultat.erreur !== 0) {
            console.log("Erreur création")
            res.status(400).send(resultat.msg);
        } else {
            res.status(201).send();
        }
    })
creationRoute.route('/:method/:value')
    .get((req, res) =>{
        console.log("Obtenir l'usager method: ", req.params.method);
        let resultat;
        if(req.params.method == "id"){
            resultat = user.obtenirUsager(req.params.value);
        }
        else if (req.params.method == "username"){
            resultat = user.obtenirUsagerUsername(req.params.value);
        }
        console.log(resultat)
        if (resultat.erreur !== 0)
            res.status(404).send(resultat);
        else
            res.json(resultat.user);
    })
module.exports = creationRoute;
