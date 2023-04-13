const {Video,videoComment,videoLike,collectModel} = require('../model/index')
const {video} = require("../middleware/validator/videoValidator");
const {hotInc, topHots} = require('../model/redis/redisHotsinc')
exports.list = async (req,res)=>{
    console.log(req.query);
    let {pageNum = 1,pageSize = 10} = req.query
    console.log(pageNum);
    const videoList = await Video.find()
        .skip((pageNum-1) * pageSize)
        .limit(pageSize)
        .sort({creatAt: -1})
        .populate('user')
    const videoCount = await Video.countDocuments()
    res.status(200).json({videoList,videoCount})
}
exports.createVideo = async (req,res) =>{
    let body = req.body
    console.log(req.user);
    body.user = req.user.userinfo._id
    const videoMoedl = new Video(body)
    try {
        const dbBack = await videoMoedl.save()
        res.status(200).json(dbBack)
    }catch (error){
        res.status(500).json(error)
    }
}
exports.video = async (req,res) =>{
    const videoId = req.params.videoId
    console.log(videoId);

    try{
        const videoDetail = await Video.findById(videoId).populate('user','_id,image username')
        if(req.user.userinfo){
            if(await videoLike.findOne({user: req.user.userinfo._id, videoId,like:1})){
                videoDetail.isLike = true
            }
        }
        hotInc(videoId,1)
        res.status(200).json(videoDetail)
    }catch (error){
        res.status(500).json(error)
    }
}
exports.comment = async (req,res) =>{
    const { videoId } = req.params
    const videoInfo = await Video.findById(videoId)
    if(!videoInfo) return res.status(401).json({error: '视频不存在'})
    const comment = await new videoComment({
        content :req.body.content,
        videoId: videoId,
        user: req.user.userinfo._id
    }).save()
    hotInc(videoId,2)
    videoInfo.commentCount++
    await videoInfo.save()
    res.status(201).json(comment)
}

exports.commentList = async (req,res) =>{
    const { videoId } = req.params
    const {pageSize = 10,pageNum = 1} = req.body
    const commentList = await videoComment
        .find({videoId})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .populate('user','_id username image')
    if(commentList){
        res.status(200).json(commentList)
    }
}
exports.deleteComment = async (req,res) => {
    const {videoId,commentId} = req.params
    const comment = await videoComment.findById(commentId)
    if(!comment){
        return res.status(404).json({error:'评论不存在'})
    }
    const videoInfo = await Video.findById(videoId)
    console.log(videoInfo);
    if(!videoInfo){
        return res.status(404).json({error:'视频不存在'})
    }
    if(!comment.user.equals(req.user.userinfo._id)) {
        return res.status(403).json({error:'没有删除权限'})
    }
    await videoComment.findByIdAndRemove(commentId)
    await videoInfo.commentCount--
    // console.log(videoInfo);
    await videoInfo.save()
    res.status(200).json({success:'删除成功'})
}
exports.like = async (req,res)=>{
    const {videoId} = req.params
    const userId = req.user.userinfo._id
    const videoInfo = await Video.findById(videoId)
    if(!videoInfo){
        return res.status(404).json({error:'视频不存在'})
    }
    const doc = await videoLike.findOne({
        user:userId,
        videoId
    })
    if(doc && doc.like === 1){
         const curLike = await videoLike.findOneAndDelete({
            user:userId,
            videoId
        })
        console.log(curLike);

        videoInfo.likeCount--
        await videoInfo.save()
        res.status(200).json({success:'已取消喜欢'})
    }else if(doc && doc.like === -1){
        doc.like = 1
        await doc.save()
        hotInc(videoId,2)
        videoInfo.disLikeCount--
        videoInfo.likeCount++
        await videoInfo.save()
    }else{
        await new videoLike({
            user:userId,
            videoId,
            like:1
        }).save()
        hotInc(videoId,2)
        if(videoInfo.likeCount){
            videoInfo.likeCount++
        }else{
            videoInfo.likeCount = 1
        }

        await videoInfo.save()
        res.status(200).json({success:'已喜欢'})
    }
}
exports.likeList = async (req,res)=>{
    const {videoId} = req.params
    const {pageNum = 1,pageSize = 10} = req.query
    const likes = await videoLike.find({
        like:1,
        user: req.user.userinfo._id
    }).skip((pageNum - 1) * pageSize).limit(pageSize).populate('videoId',"_id title vodVideoId user")
    const likeCount = await videoLike.countDocuments({
        like:1,
        user: req.user.userinfo._id
    })
    res.status(200).json({likes,likeCount})
}
exports.collect =async (req,res) => {
    const {videoId} = req.params
    const userId = req.user.userinfo._id
    const video = await Video.findById(videoId)
    if(!video){
        return res.status(404).json({error:'视频不存在'})
    }
    const doc = await collectModel.findOne({
        videoId,
        user:userId
    })
    if(doc){
        return res.status(403).json({error:'视频已收藏'})
    }
    const myCollect = await collectModel({
        videoId,
        user:userId
    })
    if(myCollect){
        await hotInc(videoId,3)
    }
}
exports.gethots = async (req,res)=>{
    const {count} = req.params
    const tops = await topHots(count)
    res.status(200).json(tops)
}