
const menu = require('./routes/menu');
const usersFilePath = "./BD/users.json";

let users = JSON.parse(fs.readFileSync(usersFilePath));

function créerUtilisateur(userInfo) {
    let maxId = 0;
    users.forEach(user => {
        if (user.Id > maxId) maxid = user.Id;
    })

    const nouvelleUsager = {
        Id: maxId + 1,
        prenom: userInfo.prenom,
        nom: userInfo.nom,
        username: userInfo.username,
        pass: userInfo.pass,
        mail: userInfo.mail,
        phone: userInfo.phone,
        isLogin: false
    };
    users.push(nouvelleUsager);
    fs.writeFileSync(usersFilePath, JSON.stringify(users));
    return { erreur: 0, msg: "Réussi" };
};
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
    /*
    supprimerCommandes,
    supprimerCommande,
    modifierCommande,
    obtenirUneCommandes,
    obtenirCommandes,
    */
};