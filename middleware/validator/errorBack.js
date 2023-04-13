const {validationResult} = require('express-validator')
module.exports = validator => {
    return async(req,res,next)=>{
        await Promise.all(validator.map(validator => validator.run(req)))
        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(401).json(error)
        }
        next()
    }
}