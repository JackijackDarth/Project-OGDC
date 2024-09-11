const fs = require('fs');

const usersFilePath = "./BD/users.json";
function connecter(req, res, next) {
    let res_authen = validerConnexion(req);

    if (res_authen.erreur !== 0) {
        let err = new Error(res_authen.msg);
        err.status = 401;
        return next(err)
    }

    return next(res_authen.userId);
}

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
    for(let user of users){
        if(user.username == username && user.pass == pass){
            found = true;
            userAuthentifier = user;
        }
    }
    //
    if (!found)
        return { erreur: 1, msg: "username / password invalide"};
    
    return { erreur: 0, msg: "username / password validés", userId: user.Id};
}

module.exports = {
    connecter,
    validerConnexion
};