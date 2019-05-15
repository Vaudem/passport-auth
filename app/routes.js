'use strict' 
// Import dependencies
var passport = require('passport');
var express = require('express');
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });

// Export the routes for our app to use
module.exports = function (app) {
    // API Route Section

    // Initialize passport for use
    app.use(passport.initialize());

    // Bring in defined Passport Strategy
    require('../config/passport')(passport);

    // Create API group routes
    var apiRoutes = express.Router();
    var userRoutes = require("./users/users.controller");
    var productRoutes = require("./products/products.controller")

    //Protected authenticated routes with JWT
    apiRoutes.get('/dashboard', requireAuth, (request, response) => {
        response.send('It worked User id is: ' + request.user.user_id + ', Email id is: ' + request.user.user_email + ' and type is : ' + request.user.user_type + '.');
    });

    apiRoutes.get('/admin', requireAuth, (request, response) => {
        if(request.user.user_type == 1){
            response.send('Welcome ADMIN!  your id is: ' + request.user.user_id + ', and type is: ' + request.user.user_type + '.');
        } else { 
            response.send(500);
        }    
    });


    // Set url for API group routes
    app.use('/api', apiRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
};
