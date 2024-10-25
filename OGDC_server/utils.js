
/**
 * Fonction qui prend la longueur désirer et créer une chaine alphanumérique aléatoire de cette grandeur
 * @param {int} longueur 
 * @returns Un string d'une chaine alphanumérique
 */
function genererChaineRandom(longueur) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < longueur; i++) {
        result += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return result;
}

module.exports = {
    genererChaineRandom
};
