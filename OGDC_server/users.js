const fs = require('fs');

const usersFilePath = "./BD/users.json";

/**
 * Créer un utilisateur dans la BD
 * Vérifier les infos et l'ajouter dans la BD si conforme
 * @param {Array} userInfo 
 * @returns 201 + nouveau user | 401
 */
function créerUtilisateur(userInfo) {
    let maxId = 0;
    let userConforme = true;
    let users = JSON.parse(fs.readFileSync(usersFilePath));
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
        //console.log(userInfo.prenom)
        //console.log(userInfo.prenom.length)
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
                idFamille:null,
                isLogin: false
            };
            users.push(nouvelleUsager);
            fs.writeFileSync(usersFilePath, JSON.stringify(users));
            return { erreur: 0, msg: "Réussi", user : nouvelleUsager};
        }
    }
    return {erreur: 1, msg: "Erreur dans les champs requis"}
};

/**
 * Connecte un user à un robot
 * Vérifie si les deux existent et si ils peuvent se connecter
 * @param {int} userId Id username
 * @param {int} robotId Id robot
 * @returns 201 | 401
 */
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

/**
 * Get un usager précis via ID
 * @param {int} userId Id username
 * @returns 201 + copie user | 401
 */
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
/**
 * Get un usager précis via USERNAME
 * @param {string} username Username user
 * @returns 201 + copie user | 401
 */
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

/**
 * Retourne la liste de tout les users
 * @returns liste de user
 */
function GetListeUsers(){
    return JSON.parse(fs.readFileSync(usersFilePath));
}

/**
 * Déconnexion d'un usager
 * @param {*} userId 
 * @returns 
 */
function Deconnexion(userId){
    let users = GetListeUsers()
    let found = false;
    let copieUser = null;
    users.forEach(user =>{
        if(user.Id == userId){
            user.isLogin = false;
            found = true;
            copieUser = user
        }
    })
    if(found){
        fs.writeFileSync(usersFilePath,JSON.stringify(users));
        return{erreur:0,msg:"Réussi", user:copieUser}
    }
    else{
        return {erreur:1,msg:"User non-trouver", user:copieUser}
    }

}

function AjouterUneFamilleAuUser(idUser,idFamille){
    let listeUsager = GetListeUsers()
    let find = false;
    listeUsager.forEach((user)=>{
        if(user.Id == idUser){
            user.idFamille = idFamille
            find = true;
        }
    })
    PostListeUsager(listeUsager);
    if(find){
        PostListeUsager(listeUsager);
        return {erreur:0,msg:"Réussi"};
    }
    else{
        return {erreur:1,msg:"userId null ou inexistant"};
    }
}

function PostListeUsager(listeUser){
    fs.writeFileSync(usersFilePath, JSON.stringify(listeUser));
}

module.exports = {
    créerUtilisateur,
    ajouterRobot,
    obtenirUsager,
    GetListeUsers,
    obtenirUsagerUsername,
    Deconnexion,
    AjouterUneFamilleAuUser
};