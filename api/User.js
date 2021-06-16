const express = require('express');
const router = express.Router();

//Use mySQL2 user model
const User = require('./../models/User');

//Password handler
const bcrypt = require('bcrypt');

//Signup
router.post('./signup', (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();

  if (name == "" || email == "" || password == "" || dateOfBirth == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!"
    })
  } else if (!/^[a-zA-Z]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered"
    })
  } else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered"
    })
  } else if (!new Date(dateOfBirth).getTime()) {
    res.json({
      status: "FAILED",
      message: "Invalid date of birth entered"
    })
  } else if (password.lenght < 8) {
    res.json({
      status: "FAILED",
      message: "Password is too short!"
    })
  } else {
    //Checking if user already exists
    User.find({ email }).then(result => {
      if (result.lenght) {
        // A user already exists
        res.json({
          status: "FAILED",
          message: "User with the provided email already exists"
        })
      } else {
        //Try to create a new user

        //password handling
        const saltRound = 10;
        bcrypt.hash(password, saltRound).then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth
          });

          newUser.save().then(result => {
            res.json({
              status: "SUCCESS",
              message: "Sign up successfull",
              data: result,
            })
          })
            .catch(err => {
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing saving user account!"
              })
            })
        })
          .catch(err => {
            res.json({
              status: "FAILED",
              message: "An error occurred while hashing password!"
            })
          })
      }
    }).catch(err => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error occurred while vhecking for existing user!"
      })
    })
  }
})

//signin
router.post('/signin', (req, res) => {

})

module.exports = router;