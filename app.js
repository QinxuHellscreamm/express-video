const express = require('express')

const app = express()
const cors = require('cors')
const morgan = require('morgan')

const router = require('./router/index')
const PORT = process.env.PORT || 3000
app.use(express.json())
//日志中间件
app.use(morgan('dev'))
//跨域中间件
app.use(cors())
// 挂载路由
app.use('/api/v1', router)

// 挂载统一处理服务端错误中间件
// app.use(errorHandler())

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
