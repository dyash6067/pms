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
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error)
    }
  });
  
  router.get('/edit/:id', checkLoginUser, async function (req, res, next) {
    try {
      const loginUser = localStorage.getItem('loginUser')
      const id = req.params.id
      const data = await passModel.findById({ _id: id });
      const data1 = await passModel.find({});
      res.render('edit_password_detail', { title: 'Password Managment System', loginUser: loginUser, records: data1, record: data, success: '' });
    } catch (error) {
      console.log(error)
    }
  });
  
  router.post('/edit/:id', checkLoginUser, async function (req, res, next) {
    try {
      const loginUser = localStorage.getItem('loginUser')
      const id = req.params.id;
      const pass_cat = req.body.pass_cat;
      const project_name = req.body.project_name;
      const pass_details = req.body.pass_details;
      await passModel.findByIdAndUpdate(id, {
        password_category: pass_cat,
        project_Name: project_name,
        password_detail: pass_details
  
      })
      const data = await passModel.findById({ _id: id });
      const data1 = await passModel.find({});
      res.render('edit_password_detail', { title: 'Password Managment System', loginUser: loginUser, records: data1, record: data, success: 'Password Updated Successfully' });
    } catch (error) {
      console.log(error)
    }
  });
  
  router.get('/delete/:id', checkLoginUser, async function (req, res, next) {
    try {
      const loginUser = localStorage.getItem('loginUser')
      const id= req.params.id;
      const passdelete = await passModel.findByIdAndDelete(id);
      res.redirect('/view-all-password');
    } catch (error) {
      console.log(error)
    }
  
  });
  
  
  
  
  
  module.exports = router;