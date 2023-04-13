const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const tojwt = promisify(jwt.sign)
const verify = promisify(jwt.verify)
const {uuid} = require('../config/config.default')
module.exports.createToken = async userinfo=>{
    const token = await tojwt({userinfo},uuid,{expiresIn:60 * 60 * 24 * 7})
    return token
}
module.exports.verfiyToken = (required = true) => {
    return async(req,res,next)=>{
        let token = req.headers.authorization
        token = token?token.split("Bearer ")[1]:null
        if(token){
            try{
                let userinfo = await verify(token,uuid)
                console.log(userinfo);
                req.user = userinfo
                next()
            }catch (error){
                res.status(402).json({error:'token无效'})
            }
        }else if(required){
            res.status(402).json({error:'缺少token'})
        }else{
            next()
        }
    }
}