import Koa from "koa";
import cors from "koa-cors";
const app = new Koa();
import setupApi from './routes/index.js'

app.use(cors());


  //setupApi :- importing the routings and passing the app for doing the routing
  setupApi(app)
  export default app