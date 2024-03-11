import youtubeRoute from './youtube.js'
const routers = [
    youtubeRoute
]
export default (app)=>{
    routers.forEach((router)=>{
        app.use(router.routes()).use(router.allowedMethods())
    })
}
