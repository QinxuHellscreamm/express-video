const RPCClient = require('@alicloud/pop-core').RPCClient;

function initVodClient(accessKeyId, accessKeySecret,) {
    const regionId = 'cn-shanghai';   // 点播服务接入地域
    const client = new RPCClient({//填入AccessKey信息
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
        apiVersion: '2017-03-21'
    });

    return client;
}
exports.getvod = async (req,res)=>{
    const client = initVodClient('LTAI5tMfyw7z61HYEok2t6vm','f71FivvPjhq8H9EVDTzXt5Q9wv9QaR');
    const vodBack = await client.request("CreateUploadVideo", {
        Title: 'this is a sample',
        FileName: 'filename.mp4'
    },{})
    res.status(200).json({vod:vodBack})
}

exports.createVideo= async (req,res,next) =>{
    const client = initVodClient('LTAI5tMfyw7z61HYEok2t6vm','f71FivvPjhq8H9EVDTzXt5Q9wv9QaR');
    const requestOption = {
        method: 'POST',
        formatParams: false,
    };
    client.request('GetPlayInfo', {"VideoId": req.body.vodVideoId}, requestOption).then((result) => {
        console.log('result',JSON.stringify(result));
        req.vod = {cover:result.VideoBase.CoverURL,playUrl:result.PlayInfoList.PlayInfo[0].PlayURL}
        next()
    }, (ex) => {
        console.log('ex',ex);
    })
    console.log(req);
}