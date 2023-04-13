const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const validator = require('../middleware/validator/userValidator')
const {verfiyToken} = require('../util/jwt')
const multer = require('multer')
const upload = multer({dest:'public/'})
router
    .get('/list',verfiyToken(),userController.list)
    .post('/register',validator.register, userController.register)
    .post('/login',validator.login, userController.login)
    .put('/',verfiyToken(),validator.update, userController.update)
    .post('/headimg',verfiyToken(),upload.single('headimg'),userController.headimg)
    .get('/subscribe/:userId',verfiyToken(),userController.subscribe)
    .get('/unsubscribe/:userId',verfiyToken(),userController.unsubscribe)
    .get('/getUser/:userId',verfiyToken(false),userController.getUser)
    .get('/getSubscribe/:userId',userController.getSubscribe)
    .post('/getChannel',verfiyToken(),userController.getChannel)


module.exports = router