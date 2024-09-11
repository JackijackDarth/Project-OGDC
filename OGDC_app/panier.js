let panier = [];
let idItemPanier = 1;

export function obtenirPanier() {
    return [...panier];
}
export function nbItemPanier() {
    return panier.length;
}
export function initPanier() {
    panier = [];
    idItemPanier = 1;
}
export function ajouterItemPanier(item) {
    panier.push({ ...item, idItem: idItemPanier});
    idItemPanier = idItemPanier + 1;
    console.log(panier);
}
export function supprimerItemPanier(itemÀSupprimer) {
    panier = panier.filter((item) => item.idItem !== itemÀSupprimer.idItem);
}

// À titre d’information, la structure du panier est la suivante :
// [
//  {
//   "idItem": 1,
//   "image": image encodée,
//   "nomItem": "Croissant", 
//   "prix": 2.5
//  }, 
//  {
//     "idItem": 2,
//     //...
//  },
//  //...
// ]
