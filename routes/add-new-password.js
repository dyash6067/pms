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
    const data = await passCatModel.find({})
    res.render('add-new-password', { title: 'Password Managment System', loginUser: loginUser, records: data, success: '' });
  });
  
  router.post('/', checkLoginUser, async function (req, res, next) {
    const loginUser = localStorage.getItem('loginUser')
    const pass_cat = req.body.pass_cat;
    const pass_details = req.body.pass_details;
    const project_Name = req.body.project_name;
    const password_details = new passModel({
      password_category: pass_cat,
      project_Name: project_Name,
      password_detail: pass_details
    })
  
    await password_details.save()
    const data = await passCatModel.find({})
    res.render('add-new-password', { title: 'Password Managment System', loginUser: loginUser, records: data, success: "password Details Inserted Successfully" });
  });
  
  
  
  
  module.exports = router;