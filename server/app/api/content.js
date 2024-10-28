const Router = require('koa-router')
// const {Auth} =require('../../middlewares/auth')
const contentRouter=new Router({
    prefix:'/content'
})
contentRouter.post('/',request=>{
    request.body=''
})
module.exports=contentRouter