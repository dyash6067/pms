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

router.get('/', checkLoginUser,  function (req, res, next) {
    try {
      const loginUser = localStorage.getItem('loginUser')
    const options = {
    offset:1, 
    limit:2
     };
      passModel.paginate({},options).then(function(result){
        
      res.render('view-all-password', { title: 'Password Managment System', loginUser: loginUser,
       records: result.docs,
      current:result.offset,
      pages:Math.ceil(result.total/result.limit)

   });
   
  });

    } catch (error) {
      console.log(error)
    }
  });

  router.get('/:page', checkLoginUser, async function (req, res, next) {
      try {
        const loginUser = localStorage.getItem('loginUser')
        const perPage=2;
        const page=req.params.page || 1;
        const data = await passModel.find({}).skip((perPage * page)-perPage).limit(perPage)
        const count=await passModel.countDocuments({});
        res.render('view-all-password', { title: 'Password Managment System', loginUser: loginUser,
         records: data,
        current:page,
      pages:Math.ceil(count / perPage)
     
    });
      } catch (error) {
        console.log(error)
      }
    });

  
  
  
  module.exports = router;