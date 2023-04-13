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

exports.createVideo= async (req,res) =>{
    console.log(req);
}