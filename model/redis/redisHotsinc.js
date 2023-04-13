const {redis} = require('./index')
exports.hotInc = async (videoId,incNumber)=>{
    const videoHots = await redis.zscore('videoHots',videoId)
    let inc
    if(videoHots){
        inc = await redis.zincrby('videoHots',incNumber,videoId)
    }else{
        inc = await redis.zadd('videoHots',incNumber,videoId)
    }
    return inc
}
exports.topHots = async (count) => {
    const sort = await redis.zrevrange('videoHots',0,-1,'withscores')
    let obj = {}
    let newArr = sort.slice(0,count*2)
    newArr.forEach((item,index)=>{
        if(i%2 == 0){
            obj[item] = newArr[index+1]
        }
    })
}