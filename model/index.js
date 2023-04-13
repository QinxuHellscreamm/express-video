const mongoose = require('mongoose')
const {mongoPath} = require('../config/config.default')
async function main(){
    await mongoose.connect(mongoPath)
}
main().then(res=>{
    console.log(res,'mongo连接成功');
}).catch(err=>{
    console.log(err);
})

module.exports = {
    User: mongoose.model('User',require('./userModel')),
    Video: mongoose.model('Video',require('./videoModel')),
    Subscribe: mongoose.model('Subscribe',require('./subscribeModel')),
    videoComment: mongoose.model('VideoComment',require('./videoCommentModel')),
    videoLike: mongoose.model('VideoLike',require('./videoLikeModel')),
    collectModel: mongoose.model('CollectModel',require('./collectModel'))
}