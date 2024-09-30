
const menu = require('./routes/menu');

let commandes = [];
let commandeId = 1;

function créerCommande(commande) {
    const id = `${commandeId}`;
    commandeId += 1;
    const nouvelleCommande = {
        id: id,
        nom: commande.nom,
        prénom: commande.prénom,
        // mobile: commande.mobile,
        // codePostal: commande.codePostal,
        statut: "En attente",
        items: commande.items,
    };
    commandes.push(nouvelleCommande);
    return { erreur: 0, msg: "créée" };
};

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

créerCommande({
    nom: "L'éponge",
    prénom: "Bob",
    items: [
        {
            "idItem": "2",
            "nomItem": "Croissant",
            "image": menu.sandwich64base,
            "prix": 2.5
        },
        {
            "idItem": "10",
            "nomItem": "Salade du marché",
            "image": menu.sandwich64base,
            "prix": 3.5
        }]
});
créerCommande({
    prénom: "joe",
    nom: "90",
    items: [
        {
            "idItem": "2",
            "nomItem": "Croissant",
            "image": menu.sandwich64base,
            "prix": 2.5
        },
        {
            "idItem": "10",
            "nomItem": "Salade du marché",
            "image": menu.sandwich64base,
            "prix": 3.5
        }]
});
créerCommande({
    prénom: "alice",
    nom: "Au pays des merveilles",
    items: [
        {
            "idItem": "2",
            "nomItem": "Croissant",
            "image": menu.sandwich64base,
            "prix": 2.5
        },
        {
            "idItem": "10",
            "nomItem": "Salade du marché",
            "image": menu.sandwich64base,
            "prix": 3.5
        }]
});

console.table(commandes);

module.exports = {
    créerCommande,
    supprimerCommandes,
    supprimerCommande,
    modifierCommande,
    obtenirUneCommandes,
    obtenirCommandes,
};