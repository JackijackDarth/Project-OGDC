const fs = require('fs');

const usersFilePath = "./BD/users.json";

function créerUtilisateur(userInfo) {
    let maxId = 0;
    let userConforme = true;
    let users = JSON.parse(fs.readFileSync(usersFilePath));
    // for(let i; i < userInfo.length; i++) {
    //     console.log(userInfo[i]);

    //     if(userInfo[i] == null) return {erreur: 1, msg: "Champ(s) null(s)"}
    // }
    if(userInfo.prenom != null && userInfo.nom != null && userInfo.username != null && userInfo.pass != null && userInfo.mail != null && userInfo.phone != null){
        users.forEach(user => {
            if (user.Id > maxId) maxId = user.Id;
            if (user.username === userInfo.username) userConforme = false
            if (user.mail === userInfo.mail) userConforme = false
        });
        const MIN_MOT = 2
        const MAX_MOT = 30
        const MIN_MDP = 8
        const MAX_MDP = 25
        console.log(userInfo.prenom)
        console.log(userInfo.prenom.length)
        if(userInfo.prenom.length < MIN_MOT || userInfo.prenom.length > MAX_MOT) userConforme = false;
        if(userInfo.nom.length < MIN_MOT || userInfo.nom.length > MAX_MOT) userConforme = false;
        if(userInfo.pass.length < MIN_MDP || userInfo.pass.length > MAX_MDP) userConforme = false;
        verifMailTab = userInfo.mail.split("@")
        if(verifMailTab.length !== 2) userConforme = false;
        if(userConforme){
            const nouvelleUsager = {
                Id: maxId + 1,
                prenom: userInfo.prenom,
                nom: userInfo.nom,
                username: userInfo.username,
                pass: userInfo.pass,
                mail: userInfo.mail,
                phone: userInfo.phone,
                idRobot: null,
                isLogin: false
            };
            users.push(nouvelleUsager);
            fs.writeFileSync(usersFilePath, JSON.stringify(users));
            return { erreur: 0, msg: "Réussi", user : nouvelleUsager};
        }
    }
    return {erreur: 1, msg: "Erreur dans les champs requis"}
};

function ajouterRobot(userId, robotId){
    let trouver = false;
    let users = JSON.parse(fs.readFileSync(usersFilePath));
    users.forEach(user => {
        if (user.Id == userId){
            user.idRobot = robotId;
            trouver = true;
        }
    });
    if(trouver){
        fs.writeFileSync(usersFilePath, JSON.stringify(users));

        return { erreur: 0, msg: "Réussi" };
    }
    return {erreur: 1, msg: "Erreur: Users non trouvé"}
}

function obtenirUsager(userId){
    let users = JSON.parse(fs.readFileSync(usersFilePath));
    let copieUser;
    let found = false;
    users.forEach(user => {
        if(user.Id == userId){
            copieUser = user
            found = true;
        }
    });
    if(found){
        return {erreur: 0, user: copieUser}
    }
    return {erreur: 1, msg: "Usager pas trouvé"}
}
function obtenirUsagerUsername(username){
    let users = JSON.parse(fs.readFileSync(usersFilePath));
    let copieUser;
    let found = false;
    console.log("Dans fonction : ",username);
    users.forEach(user => {
        if(user.username == username){
            copieUser = user
            found = true;
        }
    });
    if(found){
        return {erreur: 0, user: copieUser}
    }
    return {erreur: 1, msg: "Usager pas trouvé"}
}
function GetListeUsers(){
    let users = JSON.parse(fs.readFileSync(usersFilePath));
    return users;
}

module.exports = {
    créerUtilisateur,
    ajouterRobot,
    obtenirUsager,
    GetListeUsers,
    obtenirUsagerUsername
};