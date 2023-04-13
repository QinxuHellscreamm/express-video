const crypto = require('crypto')

const d5 = (str)=>{
    return  crypto.createHash('md5').update('dy'+ str).digest('hex')
}
module.exports = d5