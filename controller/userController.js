const { User,Subscribe } = require('../model/index')
const {createToken} = require('../util/jwt')
const fs = require('fs')
const {promisify} = require('util')
const rename = promisify(fs.rename)
const lodash = require('lodash')
exports.list = async (req,res) => {
    console.log(req.method);
    res.send('/user-list')
}
exports.register = async (req,res) => {
    console.log(req.method);
    const userModel = new User(req.body)
    const dbBack = await userModel.save()
    const user = dbBack.toJSON()
    delete user.password
    res.status(201).json(user)
}
exports.login = async(req,res) =>{
    //客户端数据验证
    //链接数据库查询
    // console.log(111);
    let dbBack = await User.findOne(req.body)
    if(!dbBack){
        res.status(402).json('邮箱或者密码不正确')
    }else{
        console.log(dbBack);
        dbBack = dbBack.toJSON()
        dbBack.token = await createToken(dbBack)
        res.status('200').json(dbBack)
    }
}

exports.update = async (req,res) => {
    console.log(req.user.userinfo);
    const update = await User.findByIdAndUpdate(req.user.userinfo._id,req.body,{new:true})
    if(update){
        res.status('200').json(update)
    }
}
exports.headimg= async (req,res) => {
    console.log(req.file);
    const fileArr = req.file.originalname.split('.')
    const fileType = fileArr[fileArr.length - 1]
    try {
        await rename('./public/'+req.file.filename,'./public/'+req.file.filename+'.'+fileType)
        res.status(201).json({filepath:req.file.filename+'.'+fileType})
    } catch (error){
        res.status(500).json(error)
    }
}
// 关注频道
exports.subscribe= async (req,res) => {
    const userId = req.user.userinfo._id
    const channelId = req.params.userId
    if(userId === channelId){
        res.status(401).json({error:'不能关注自己'})
    }
    const record = await Subscribe.findOne({
        user: userId,
        channel: channelId
    })
    if(!record){
        await new Subscribe({
            user: userId,
            channel: channelId
        }).save()
        const user = await User.findById(channelId)
        user.subscribeCount++
        await user.save()
        res.status(200).json({success:'关注成功'})
    }else{
        res.status(401).json({success:'已经关注过了'})
    }
}
exports.unsubscribe= async (req,res) => {
    const userId = req.user.userinfo._id
    const channelId = req.params.userId
    if(userId === channelId){
        res.status(401).json({error:'不能取消关注自己'})
    }
    const record = await Subscribe.findOneAndRemove({
        user: userId,
        channel: channelId
    })
    if(record){
        const user = await User.findById(channelId)
        user.subscribeCount--
        await user.save()
        res.status(200).json({success:'取消关注成功'})
    }else{
        res.status(401).json({success:'还未关注'})
    }
}
exports.getUser = async (req,res) => {
    let isSubscribe = false
    if(req.user){
        const record = await Subscribe.findOne({
            user: req.user.userinfo._id,
            channel: req.params.userId
        })
        if(record) isSubscribe = true
    }
    const user = await User.findById(req.params.userId)
    console.log(user.username);
    const {image, _id, username} = user
    const dbBack = {image, _id, username,isSubscribe}
    console.log(dbBack);
    if (user){
        res.status(200).json(dbBack)
    }
}
exports.getSubscribe = async (req,res) => {
    let subscrobeList = await Subscribe.find({user:req.params.userId}).populate('channel')
    console.log(subscrobeList);
    subscrobeList = subscrobeList.map(item=>{
       return  lodash.pick(item.channel,['_id','image','username','cover','channelDes','subscribeCount'])
    })
    res.status(200).json(subscrobeList)
    console.log(subscrobeList);

}
exports.getChannel = async (req,res) => {
    let channelList = await Subscribe.find({channel:req.user.userinfo._id}).populate('user')
    console.log(channelList);
    channelList = channelList.map(item=>{
        return  lodash.pick(item.user,['_id','image','username','cover','channelDes','subscribeCount'])
    })
    res.status(200).json(channelList)
    console.log(channelList);
}
