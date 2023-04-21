/**
 * 默认配置
 */
require('dotenv').config()
module.exports.uuid = '9125a8dc-52ee-365b-a5aa-81b0b3681cf6'
console.log('hah',process.env);
module.exports.mongoPath = 'mongodb://'+process.env.DB_HOST ? process.env.DB_HOST : '0.0.0.0' +':27017/express-video'
module.exports.redisClient = {
    port:6379,
    host:'39.106.21.210',
    username: "default",
    password: 'root'
}
