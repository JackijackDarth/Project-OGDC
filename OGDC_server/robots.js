const fs = require('fs');
const users = require('./users.js');

const robotsFilePath = "./BD/listeRobots.json";
let listeRobots = JSON.parse(fs.readFileSync(robotsFilePath));

function créerRobot(robotInfo) {
    let double = false;
    maxId = 0
    listeRobots.forEach(robot => {
        if(robot.Id > maxId)
            maxId = robot.Id;
        if(robot.username == robotInfo.username)
            double = true;
    });
    if(!double){
        const nouveauRobot = {
            Id: maxId,
            username: robotInfo.username,
            password: robotInfo.password
        }
        listeRobots.push(nouveauRobot)
        fs.writeFileSync(robotsFilePath, JSON.stringify(listeRobots));
        return { erreur: 0, msg: "Réussi" };
    }

    return { erreur: 1, msg: "Robot déja existant" };
};
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
    connecter = false;
    listeRobots.forEach(robot => {
        if(robot.Id == connexionInfo.rbtId )
            if(robot.password == connexionInfo.MdpRbt)
                connecter = true;
    });
    if(connecter){
        console.log("cnn info:",connexionInfo.usrId)
        users.ajouterRobot(connexionInfo.usrId, connexionInfo.rbtId)
        return { erreur: 0, msg:"Réussi"}
    }
    return {erreur:1, msg:"Id ou password erroné"}
}
function obtenirUsagerSync(userPI){
    idRobot = null;
    listeRobots.forEach(robot => {
        console.log(robot.username, userPI);
        console.log(robot.username == userPI);
        if(robot.username == userPI)
            idRobot = robot.Id
    })
    console.log('idRobot : ',idRobot);
    if(idRobot != null){
        listeUsers = users.GetListeUsers()
        let userEnvoyer = null;
        console.log('listeUser : ',listeUsers);
        listeUsers.forEach(user => {
            console.log('user.idRobot : ',user.idRobot);
            if(user.idRobot == idRobot)
                userEnvoyer = user;
        })
        if(userEnvoyer != null){
            return {erreur: 0, msg: "Réussi", user: userEnvoyer}
        }
        else{
            return {erreur: 1, msg: "Robot non syncroniser", user: null}
        }
    }
    return {erreur: 1, msg: "Username robot inexistant", user: null}

}

module.exports = {
    créerRobot,
    obtenirRobots,
    connexionRobots,
    obtenirUsagerSync
};