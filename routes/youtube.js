
import Router from "koa-router";
import validate from "../middleware/validate/index.js";
import { isUrlAvailable, isUrlValid } from "../validators/youtube/index.js";
import { downloadYtVideo } from "../controller/youtube/index.js";

const router = new Router({
    prefix: '/youtube',
  })
  

router.get('/video/download',validate([isUrlAvailable,isUrlValid]),downloadYtVideo)

export default router
