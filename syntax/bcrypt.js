const bcrypt = require('bcrypt');
const {hash} = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = 'pw.1234';
const someOtherPlaintextPassword = 'pw.2345';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash)
    bcrypt.compare(myPlaintextPassword, hash, function (err, result){
        console.log('password', result)
    })

    bcrypt.compare(someOtherPlaintextPassword, hash, function (err, result){
        console.log('password', result)
    })

});

