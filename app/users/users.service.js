'use strict'

// logique (préparer la requête) - gestion des erreurs (questionne bd si user existe...)
// ex: clignotant voiture : capte si haut/bas activé du controller

var config = require('../../config/main');
var jwt = require('jsonwebtoken');
var crypt = require('../helpers/crypt');
var db = require('../helpers/db');

module.exports = {
    authenticate,
    register,
    updateType,
    getUsers
};


function register (userParam, callback){
    if (!userParam.email || !userParam.password) {
        return callback({ success: false, message: 'Please enter email and password.' });
    } else {
        var newUser = {
            email: userParam.email,
            password: userParam.password
        };

        // Attempt to save the user
        db.createUser(newUser, (res) => {
            return callback({ success: true, message: 'Successfully created new user.' });
        }, (err) => {
            return callback({ success: false, message: 'That email address already exists.' });
        });
    }
}

function authenticate ({ email, password }, callback){
    db.findUser({
        email: email
    }, (res) => {
        var user = {
            user_id: res.user_id,
            user_email: res.user_email,
            is_active: res.is_active,
            user_type: res.user_type
        };

        // Check if password matches
        crypt.compareHash(password, res.password, (err, isMatch) => {
            if (isMatch && !err) {
                // Create token if the password matched and no error was thrown
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 10080 // in seconds
                });
                return callback({ success: true, token: token });
            } else {
                return callback({
                    success: false,
                    message: 'Authentication failed. Passwords did not match.'
                });
            }
        });
    }, function (err) {
        return callback({ success: false, message: 'Authentication failed. User not found.' });
    });
}

/*function updateType ({ id, type }, callback){
    if (!type) {
        return callback({ success: false, message: 'Please enter type.' });
    } else {
        var newParam = {
            id: id,
            type: type
        };
        console.log("newParam ", newParam)

        // Attempt to save the user
        db.updateType(newParam, () => {
            return callback({ success: true, message: 'Successfully type.' });
        }, (err) => {
            return callback(err);
        });
    }
}*/

//qdan
//request va avoir accès, grâce au passport, aux infos de l'user
//passport transpile l'objet user

function updateType(request, callback) {
    // fonction appelée dans controller
    // comme pour authenticate on vérifie si y'a un user (fonction définie dans db.js)
    // findUser(email, callback si y'a user)
    // res = successCallback()  |    err = failureCallback()

    console.log("COUCOU MAIL ", request.user.email);
    db.findUser({
        email: request.user.email
    }, 
    (res) => {
        let updatedUser = {
            user_id: request.user.user_id,
            user_type: request.body.user_type
        }

        db.updateType(
            updatedUser
            , (res) => {
                return callback({ success: true, message: 'Successfully updated user.' });
            }, (err) => {
                return callback({ success: false, message: "Update failed. User type wasn't valid" });
            })
    }, 
    (err) => {
        return callback({ success: false, message: 'Update failed. User not found.' });
    })
}

function getUsers ({id}, callback){
    // get users
    db.getUsers({id}, (res) => {
        return callback(res);
    }, (err) => {
        return callback(err);
    });
}

