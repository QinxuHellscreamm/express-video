const {body,validationResult} = require('express-validator')
const validate = require('./errorBack')
module.exports.video = validate([
    body('title').notEmpty().withMessage('视频名不能为空').bail()
        .isLength({max:20}).withMessage('视频名称长度不能大于20').bail(),
    body('vodVideoId').notEmpty().withMessage('vodVideoId不能为空').bail()
])
