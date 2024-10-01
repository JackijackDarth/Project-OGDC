const fs = require('fs');
const users = require('./users.js');

const robotsFilePath = "./BD/listeRobots.json";
let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));

function créerRobot(robotInfo) {
    let double = false;
    let maxId = 0;

    if (!Array.isArray(listeRobots)) {
        listeRobots = [];
    }

    listeRobots.forEach(robot => {
        if (robot.Id > maxId) {
            maxId = robot.Id;
        }
        if (robot.username === robotInfo.username) {
            double = true;
        }
    });

    if (!double) {
        const nouveauRobot = {
            Id: maxId + 1,
            username: robotInfo.username,
            password: robotInfo.password
        };
        listeRobots.push(nouveauRobot);

        fs.writeFileSync(robotsFilePath, JSON.stringify(listeRobots, null, 2));
        return { erreur: 0, msg: "Réussi" };
    }

    return { erreur: 1, msg: "Robot déjà existant" };
}

function obtenirRobots() {
    let robots = listeRobots.map((robot) => {
        return {
            Id: robot.Id,
            username: robot.username,
            password: robot.password,
        }
    });

    return robots;
}

function connexionRobots(connexionInfo){
    let connecter = false;

    listeRobots.forEach(robot => {
        if (robot.Id === connexionInfo.rbtId && robot.password === connexionInfo.MdpRbt) {
            connecter = true;
        }
    });

    if (connecter) {
        console.log("Connexion réussie pour le robot ID :", connexionInfo.rbtId);

        const resultatAjout = users.ajouterRobot(connexionInfo.usrId, connexionInfo.rbtId);
        console.log("Résultat de l'ajout du robot à l'utilisateur :", resultatAjout);

        return { erreur: 0, msg: "Réussi" };
    }

    return { erreur: 1, msg: "Id ou password erroné" };
}

function obtenirUsagerSync(userPI) {
    let idRobot = null;

    listeRobots.forEach(robot => {
        if (robot.username === userPI) {
            idRobot = robot.Id; // Stocker l'ID du robot
        }
    });

    if (idRobot != null) {
        const listeUsers = users.GetListeUsers();
        let usersEnvoyer = [];

        listeUsers.forEach(user => {
            if (user.idRobot === idRobot) {
                usersEnvoyer.push(user);
            }
        });

        if (usersEnvoyer.length > 0) {
            return { erreur: 0, msg: "Réussi", users: usersEnvoyer };
        } else {
            return { erreur: 1, msg: "Robot non synchronisé", user: null };
        }
    }

    return { erreur: 1, msg: "Username robot inexistant", user: null };
}



module.exports = {
    créerRobot,
    obtenirRobots,
    connexionRobots,
    obtenirUsagerSync
};