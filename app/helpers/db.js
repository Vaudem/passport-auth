"use strict";

// fait les requêtes (que ça fonctionne ou pas)

var mysql = require("mysql");
var crypt = require("./crypt");
var config = require("../../config/main");
var db = {};
// Creating a connection object for connecting to mysql database
var connection = mysql.createConnection({
  host: config.database_host,
  user: config.database_user,
  password: config.database_password,
  database: config.database_name,
  socketPath: config.database_socket
});


//Connecting to database
connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
  // threadId : callback si la connection est un succès
});


/////////// USERS ///////////

db.createUser = (user, successCallback, failureCallback) => {
  var passwordHash;
  crypt.createHash(
    user.password,
    (res) => {
      passwordHash = res;
      connection.query(
        "INSERT INTO `passport-auth`.`users` (`user_email`, `password`) VALUES ('" +
          user.email +
          "', '" +
          passwordHash +
          "');",
        (err, rows, fields, res) => {
          if (err) {
            failureCallback(err);
            return;
          }
          successCallback();
        }
      );
    },
    (err) => {
      failureCallback();
    }
  );
};

db.findUser = (user, successCallback, failureCallback) => {
  var sqlQuery =
    "SELECT * FROM `passport-auth`.users WHERE `user_email` = '" +
    user.email +
    "';";
  connection.query(sqlQuery, (err, rows, fields, res) => {
    if (err) {
      failureCallback(err);
      return;
    }
    if (rows.length > 0) {
      successCallback(rows[0]);
    } else {
      failureCallback("User not found.");
    }
  });
};

db.updateType = (user, successCallback, failureCallback)=>{
  var sqlQuery = 
    "UPDATE `passport-auth`.`users` SET `user_type`= '" + user.user_type + "' WHERE `user_id` = '" + user.user_id + "';";
    const q = connection.query(sqlQuery, (err, rows, fields, res) => {
      if (err) {
        failureCallback(err);
        return;
      } else {
        successCallback();
      }
    });
  console.log(q.sql)
}

// successCallback = resolve (promise)
// failureCallback = reject(promise)

db.getUsers = (user, successCallback, failureCallback)=>{
  var sqlQuery;
  if(!user.id) sqlQuery= `SELECT user_id, user_email, user_type FROM users`;
  else sqlQuery = `SELECT user_id, user_email, user_type FROM users WHERE user_id= ${user.id}`;
  
  const q = connection.query(sqlQuery, (err, rows, fields, res) => {
    if (err) {
      failureCallback(err);
      return;
    } else {
      successCallback(rows); //exécute la fonction définie dans service
    }
  });
  console.log(q.sql)
}




/////////// PRODUCTS ///////////


db.addProduct = (product, successCallback, failureCallback) => {
  var sqlQuery = 
    "INSERT INTO `passport-auth`.`products` (`product_name`, `product_price`) VALUES ('" +
    product.name +
    "', '" +
    product.price +
    "');";
    const q = connection.query(sqlQuery, (err, rows, fields, res) => {
      if (err) {
        failureCallback(err);
        return;
      } else {
        successCallback();
      }
    });
  console.log(q.sql)
};

db.getProduct = (product, successCallback, failureCallback) => {
  var sqlQuery;
  if(!product.id){
    sqlQuery = 
    "SELECT * FROM `passport-auth`.`products`";
    
  } else {
    sqlQuery = 
    "SELECT * FROM `passport-auth`.`products` WHERE product_id = '" +
    product.id +
    "';";
  }
  const q = connection.query(sqlQuery, (err, rows, fields, res) => {
    if (err) {
      failureCallback(err);
      return;
    } else {
      successCallback(rows);
    }
  });
  console.log(q.sql)
};


db.deleteProduct = (product, successCallback, failureCallback) => {
  var sqlQuery = 
    "DELETE FROM `passport-auth`.`products` WHERE product_id = '" +
    product.id +
    "';";
    const q = connection.query(sqlQuery, (err, rows, fields, res) => {
      if (err) {
        failureCallback(err);
        return;
      } else {
        successCallback();
      }
    });
  console.log(q.sql)
};


db.update = (product, successCallback, failureCallback) => {
  var sqlQuery = 
  `UPDATE products SET product_name = '${product.name}', product_price=${product.price},product_description='${product.description}', product_category='${product.category}' WHERE product_id=${product.id}`;
    const q = connection.query(sqlQuery, (err, rows, fields, res) => {
      if (err) {
        failureCallback(err);
        return;
      } else {
        successCallback();
      }
    });
  console.log(q.sql)
};

module.exports = db;
