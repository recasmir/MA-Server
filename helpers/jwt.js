const jwt = require('jsonwebtoken');


const generarJWT = (uid, fName) => {
    
    const payload = { uid, fName };

    return new Promise( (resolve,reject) => {
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn:'24h'
        }, (err, token) => {
            if(err){
                // salió mal
                console.log(err);
                reject(err);
            } else {
                //todo bien
                resolve(token);
            }
        })
    })

}

module.exports = {
    generarJWT
}
