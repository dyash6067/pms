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

const checkUser = async (req, res, next) => {
  try {
    var uname = req.body.uname
    var checkexitemail = await userModule.findOne({ username: uname })
    if (checkexitemail) {
      return res.render('signup', { title: 'Password Managment System', msg: 'User Already Exit' });
    }
    next();
  } catch (error) {
    console.log(error)
  }
}



/* GET home page. */
router.get('/', function (req, res, next) {

  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('./dashboard')
  } else {
    res.render('index', { title: 'Password Managment System', msg: '' });
  }

});

router.post('/', async function (req, res, next) {
  const username = req.body.uname;
  const password = req.body.password;
  const checkUser = await userModule.findOne({ username: username })
  const getPassword = checkUser.password;
  if (bcrypt.compareSync(password, getPassword)) {
    const getUserId = checkUser._id;
    const token = jwt.sign({ userId: getUserId }, 'loginToken')
    localStorage.setItem('userToken', token)
    localStorage.setItem('loginUser', username)
    res.redirect('./dashboard');
  } else {
    res.render('index', { title: 'Password Managment System', msg: "Invalid Username or Password" });
  }

});
router.get('/signup', function (req, res, next) {
  const loginUser = localStorage.getItem('loginUser')
  if (loginUser) {
    res.redirect('./dashboard')
  } else {
    res.render('signup', { title: 'Password Managment System', msg: '' });
  }
});

router.post('/signup', [checkUser, checkEmail], async function (req, res, next) {
  try {
    const username = req.body.uname;
    const email = req.body.email;
    var password = req.body.password;
    const confpassword = req.body.confpassword;
    if (password != confpassword) {
      res.render('signup', { title: 'Password Managment System', msg: 'password not match' });
    } else {
      password = bcrypt.hashSync(req.body.password, 10)
      const userDetails = new userModule({
        username: username,
        email: email,
        password: password,
      })
      const result = await userDetails.save()
      res.render('signup', { title: 'Password Managment System', msg: 'User Registerd Successfully' });
    }
  } catch (error) {
    console.log(error)
  }

});



// router.get('/view-all-password', checkLoginUser, async function (req, res, next) {
//   try {
//     const loginUser = localStorage.getItem('loginUser')
//     const perPage=2;
//     const page=req.params.page || 1;
//     const data = await passModel.find({}).limit(perPage).skip((perPage * page)-perPage)
//     const count=await passModel.countDocuments({});
//     res.render('view-all-password', { title: 'Password Managment System', loginUser: loginUser,
//      records: data,
//     current:page,
//   pages:Math.ceil(count /perPage)
//  });
//   } catch (error) {
//     console.log(error)
//   }
// });

// router.get('/view-all-password/:page', checkLoginUser, async function (req, res, next) {
//   try {
//     const loginUser = localStorage.getItem('loginUser')
//     const perPage=1;
//     const page=req.params.page || 1;
//     const data = await passModel.find({}).limit(perPage).skip((perPage * page)-perPage)
//     const count=await passModel.countDocuments({});
//     res.render('view-all-password', { title: 'Password Managment System', loginUser: loginUser,
//      records: data,
//     current:page,
//   pages:Math.ceil(count /perPage)
//  });
//   } catch (error) {
//     console.log(error)
//   }
// });


router.get('/logout', function (req, res, next) {
  localStorage.removeItem('userToken')
  localStorage.removeItem('loginUser')
  res.redirect('/');
});




module.exports = router;
