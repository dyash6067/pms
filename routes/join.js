var express = require('express');
var router = express.Router();
const userModule = require('../model/user.js')
const passCatModel = require('../model/password_category.js')
const passModel = require('../model/add_password.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req, res, next) {
  try {
    const userToken = localStorage.getItem('userToken')
    const decode = jwt.verify(userToken, 'loginToken')

  } catch (error) {
    res.redirect('/')
  }
  next();
}

const checkEmail = async (req, res, next) => {
  try {
    var email = req.body.email
    var checkexitemail = await userModule.findOne({ email: email })
    if (checkexitemail) {
      return res.render('signup', { title: 'Password Managment System', msg: 'Email Already Exit' });
    }
    next();
  } catch (error) {
    console.log(error)
  }
}

router.get('/', checkLoginUser, async function (req, res, next) {
    try {
      const loginUser = localStorage.getItem('loginUser')

     const result= await passModel.aggregate([
        {
           $lookup:
           {
            from:'password_categories',
            localField:'password_category',
            foreignField:'password_category',
            as:'pass_cat-details'
           }
        },
        {$unwind:'$pass_cat-details'}
      ])
 
console.log(result)
res.send(result)

    } catch (error) {
      console.log(error)
    }
  });


  
  
  
  module.exports = router;