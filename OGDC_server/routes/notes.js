const fs = require('fs');
const { Router } = require('express');
const notes = require('../notes');

const notesRoutes = Router();


notesRoutes.route('/')
    .post((req, res) => {
        console.log("Création note  ");
        const resultat = notes.CreerNotes(req.body);
        if (resultat.erreur !== 0) {
            res.status(401).send(resultat);
        } else {
            res.status(201);
        }
    });

notesRoutes.route('/:method/:param1')
    .delete((req,res)=>{
        if(req.params.method == "delete"){
            console.log("Commande delete : ", req.params.param1);
            let resultat = notes.SupprimerNote(req.params.param1);
            console.log(resultat);
            if (resultat.erreur !== 0) {
                res.status(401).send(resultat);
            } else {
                res.status(201).send(resultat);
            }
        }
    })
    .get((req,res)=>{
        if(req.params.method == "get"){
            console.log("Obtenir les notes pour la famille : ",req.params.param1);
            const resultat = notes.ObtenirNotesFamille(req.params.param1);
            console.log("Résultat de obtenirTouteCommandes:", resultat);
            
            if (resultat.erreur !== 0) {
                res.status(401).send(resultat);
            } else {
                res.json(resultat.notes);
            }
        }
    })

module.exports = notesRoutes;
