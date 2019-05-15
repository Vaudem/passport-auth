// controller envoie response au server (route déclarée ici, en fonction de celle-ci on envoie une response) - ping-pong du server   
// ex: clignotant voiture : controller = routes haut /bas


const express = require("express");
const router = express.Router();
const userService = require("./users.service");
var passport = require('passport');
// require passport pour le token pour les routes: admin
var requireAuth = passport.authenticate('jwt', { session: false });

// routes
router.get("/all", getUsers);
router.post("/authenticate", authenticate);
router.post("/register", register);

// router.patch("/type", updateType);

router.put("/type", requireAuth, updateType);




module.exports = router;

function register(req, res) {
    userService
        .register(req.body, result => {
            result.success ? res.status(201).json(result) : res.status(401).json(result);
        })
}

function authenticate(req, res) {
    userService
        .authenticate(req.body, result => {
            result.success ? res.status(201).json(result) : res.status(401).json(result);
        })
}

function updateType(req, res) {
    userService
        .updateType(req, result => {
            result.success ? res.status(201).json(result) : res.status(401).json(result);
        })
    //fonction définie dans service
}

function getUsers(req, res) {
    console.log("req! ", req.params)
    userService
    .getUsers(req.params, result => {
        result ? res.status(201).json(result) : res.status(401).json(result);
    })
}
