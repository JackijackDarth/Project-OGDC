const fs = require('fs');

const usersFilePath = "./BD/users.json";
/**
 * Connecter une usager
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 * @returns 
 */
function connecter(req, res, next) {
    let res_authen = validerConnexion(req);

    if (res_authen.erreur !== 0) {
        let err = new Error(res_authen.msg);
        err.status = 401;
        return next(err)
    }

    return next(res_authen.userId);
}
/**
 * Connexion de l'usager voir si il est dans la base de donné
 * @param {Request} req 
 * @returns 
 */
function validerConnexion(req) {
    const authheader = req.headers.authorization;
    console.log(req.headers);

    if (authheader === undefined)
        return { erreur: 1, msg: "Entête authorization absente"};

    const auth = authheader.split(' ')[1].split(':');
    const username = auth[0];
    const pass = auth[1];
    console.log(auth);
    console.log(username);
    console.log(pass);
    //
    let users = JSON.parse(fs.readFileSync(usersFilePath));
    let found = false;
    let userAuthentifier;
    console.log(users);
    for(let i = 0; i < users.length; i++){
        if(users[i].username == username && users[i].pass == pass){
            found = true;
            userAuthentifier = users[i];
        }
    }
    //
    if (!found){
        return { erreur: 1, msg: "username / password invalide"};
    }   
    userAuthentifier.isLogin = true;
    fs.writeFileSync(usersFilePath, JSON.stringify(users));
    return { erreur: 0, msg: "username / password validés", userId: userAuthentifier.Id};
}

module.exports = {
    connecter,
    validerConnexion
};