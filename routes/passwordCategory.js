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
    const loginUser = localStorage.getItem('loginUser')
    const data = await passCatModel.find({});
    res.render('password_category', { title: 'Password Managment System', loginUser: loginUser, records: data });
  });

  router.get('/edit/:id', checkLoginUser, async function (req, res, next) {
    const loginUser = localStorage.getItem('loginUser')
    const passcat_id = req.params.id;
    const data = await passCatModel.findById(passcat_id);
    res.render('edit_pass_category', { title: 'Password Managment System', loginUser: loginUser, errors: '', success: '', records: data, id: passcat_id });
  });
  
  router.post('/edit/', checkLoginUser, async function (req, res, next) {
    const loginUser = localStorage.getItem('loginUser')
    const passcat_id = req.body.id;
    const passwordCategory = req.body.passwordCategory;
    const update_passCat = await passCatModel.findByIdAndUpdate(passcat_id, {
      password_category: passwordCategory
    });
    res.redirect('/passwordCategory');
  });
  
  router.get('/delete/:id', checkLoginUser, async function (req, res, next) {
    const loginUser = localStorage.getItem('loginUser')
    const passcat_id = req.params.id;
    const passdelete = await passCatModel.findByIdAndDelete(passcat_id);
  
    res.redirect('/passwordCategory');
  });
  
  
  
  
  module.exports = router;