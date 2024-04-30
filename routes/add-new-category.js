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
    const loginUser = localStorage.getItem('loginUser');
    res.render('addNewCategory', { title: 'Password Managment System', loginUser: loginUser, errors: '', success: '' });
  });
  
  router.post('/', checkLoginUser, [check('passwordCategory', 'Enter Password Category Name').isLength({ min: 1 })], async function (req, res, next) {
    try {
      const loginUser = localStorage.getItem('loginUser')
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('addNewCategory', { title: 'Password Managment System', loginUser: loginUser, errors: errors.mapped(), success: '' });
      } else {
        const passCatName = req.body.passwordCategory;
        const passCatDetails = new passCatModel({
          password_category: passCatName
        });
        await passCatDetails.save();
  
        res.render('addNewCategory', { title: 'Password Managment System', loginUser: loginUser, errors: '', success: 'Password category inserted successfully' });
      }
    } catch (error) {
      console.log(error)
    }
  
  });
  
  module.exports = router;