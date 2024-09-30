const fs = require('fs');

const { Router } = require('express');
const authen = require('../verifierConnexion');
const usersFilePath = "./BD/users.json";
const robot = require('../robots');


const connexionRoutes = Router();

connexionRoutes.get('/', (req, res) => {
    console.log("connexion");

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
                prenom : user.prenom,
                nom : user.nom,
                mail: user.mail,
                phone : user.phone,
                rbtId : user.idRobot,
                usrname : user.username,
                isLogin : user.isLogin
            });
        }
    }});
connexionRoutes.route('/:userPI')
    .get((req, res) =>{
        console.log("Obtenir l'usager pour le robot %d", req.params.userPI);
        const resultat = robot.obtenirUsagerSync(req.params.userPI);
        if (resultat.erreur !== 0)
            res.status(404).send(resultat);
        else
            res.json(resultat.user);
    })

module.exports = connexionRoutes;
