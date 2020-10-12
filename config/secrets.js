module.exports = {
    jwtSecret: process.env.JWT_SECRET || "its a secret",
};


//secrets uses a specila algorithm(HS256) used to sign the JWT so that the secret can be used to both encrypt and decrypt our key. (symmetric key be)
//secret key + header + payload = hash/token!

//** */both othe these two along secret is what is going to generate the token
// header: {
//     alg:"HS256",
//     typ: JWT
// }

// const payload = {
//     subject: user.id,
//     username: user.username,
//     lat: Date.now()
//   }