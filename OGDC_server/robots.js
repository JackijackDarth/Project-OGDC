const fs = require('fs');
const users = require('./users.js');

const robotsFilePath = "./BD/listeRobots.json";
/**
 * Création d'un robot
 * @param {Array} robotInfo 
 * @returns status 201 || 401
 */
function créerRobot(robotInfo) {
    let double = false;
    let maxId = 0;

    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));

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

        fs.writeFileSync(robotsFilePath, JSON.stringify(listeRobots));
        return { erreur: 0, msg: "Réussi" };
    }

    return { erreur: 1, msg: "Robot déjà existant" };
}
/**
 * Obtenir une liste de tout les robots
 * @returns liste de robot
 */
function obtenirRobots() {
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));

    let robots = listeRobots.map((robot) => {
        return {
            Id: robot.Id,
            username: robot.username,
            password: robot.password,
        }
    });

    return robots;
}
/**
 * Permet de se connecter à un robot via ses infos
 * @param {Array} connexionInfo table Id, MDP
 * @returns 201 | 401
 */
function connexionRobots(connexionInfo){
    let connecter = false;
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));

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

/**
 * Permet de get l'usager associer au robot
 * @param {string} userPI username PI
 * @returns 201 + user | 401
 */
function obtenirUsagerSync(userPI) {
    let idRobot = null;
    let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));
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