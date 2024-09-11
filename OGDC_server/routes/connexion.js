const fs = require('fs');

const { Router } = require('express');
const authen = require('../verifierConnexion');
const usersFilePath = "./BD/users.json";

const connexionRoutes = Router();

connexionRoutes.get('/', (req, res) => {
    console.log("authentification");

    let res_authen = authen.validerConnexion(req);

    if (res_authen.erreur !== 0) {
        res.status(401).send({ erreur: 1, msg: res_authen.msg});
        return;
    }

    let users = JSON.parse(fs.readFileSync(usersFilePath));
    for(let user of users){
        if(user.Id == res_authen.userId){
            res.json({
                Id: user.Id,
                prénom : user.prenom,
                nom : user.nom,
                mail: user.mail,
                phone : user.phone
            });
        }
    }

});

module.exports = connexionRoutes;
