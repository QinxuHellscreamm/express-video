
const Redis = require("ioredis");
const {redisClient} = require('../../config/config.default')
const redis = new Redis(redisClient)
redis.on('error',err=>{
    if (err){
        console.log('redis 链接错误');
        console.log(err);
        redis.quit()
    }
})
redis.on('ready',()=>{
    console.log('redis链接成功');
})
exports.redis = redis