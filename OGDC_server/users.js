const fs = require('fs');

const usersFilePath = "./BD/users.json";

let users = JSON.parse(fs.readFileSync(usersFilePath));

function créerUtilisateur(userInfo) {
    let maxId = 0;
    let userConforme = true;
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
function GetListeUsers(){
    return users;
}
/*
function supprimerCommandes() {
    commandes = [];
};

function supprimerCommande(id) {
    let idx = commandes.findIndex((commande) => commande.id === id);
    if (idx === -1)
        return { erreur: 1, msg: "commande id invalide" };

    commandes = commandes.filter((commande) => commande.id !== id);
    return { erreur: 0, msg: "supprimée" };
};

function modifierCommande(id, commandeModifiée) {
    let idx = commandes.findIndex((commande) => commande.id === id);
    if (idx === -1)
        return { erreur: 1, msg: "commande id invalide" };

    commandes = commandes.map((commmande) => (commmande.id === id ? {
        ...commmande,
        items: commandeModifiée.items,
        // nom: commandeModifiée.nom,
        // mobile: commandeModifiée.mobile,
        // codePostal: commandeModifiée.codePostal,
        // statut: commandeModifiée.statut,
    } : commmande));

    return { erreur: 0, msg: "modifiée" };
};
function obtenirUneCommandes(id) {
    let comm = commandes.find((commande) => commande.id === id);
    if (comm === undefined)
        return { erreur: 1, msg: "commande id invalide" };

    return { erreur: 0, msg: "obtenue", commande: comm };
}
function obtenirCommandes() {
    let comm = commandes.map((commande) => {
        return {
            id: commande.id,
            nom: commande.nom,
            prénom: commande.prénom,
            statut: commande.statut,
        }
    });

    return comm;
}
*/

module.exports = {
    créerUtilisateur,
    ajouterRobot,
    obtenirUsager,
    GetListeUsers
};