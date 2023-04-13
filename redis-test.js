const Redis = require('ioredis')
const redis = new Redis({
    port:6379,
    host:'39.106.21.210',
    username: "default",
    password: 'root',
    lazyConnect: true,
    db: 0,
})
redis.set('mykey','value')
redis.get("*", (err, result) => {
    if (err) {
        console.error(err);
    } else {
        console.log(result); // Prints "value"
    }
});
