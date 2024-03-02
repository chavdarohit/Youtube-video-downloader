import Koa from "koa";
import Router from "koa-router";
import cors from "koa-cors";
import ytdl from "ytdl-core";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
const app = new Koa();
const router = new Router();

app.use(cors());

router.get("/download", async (ctx) => {
  const { URL } = ctx.query;
  if (!URL) {
    ctx.status = 400;
    ctx.body = "Missing URL parameter";
    return;
  }
  function extractVideoId(url) {
    var regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
    return null;
  }
  console.log("Url", URL);
  const videoId = extractVideoId(URL);
  console.log("video ID", videoId);
  if (!videoId) {
    ctx.status = 400;
    ctx.body = "Invalid YouTube URL";
    return;
  }

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const title = (await ytdl.getInfo(videoUrl)).videoDetails.title;
    const outputPath = `./output/${title}.mp4`;

    // Create output directory if it doesn't exist
    if (!fs.existsSync("./output")) {
      fs.mkdirSync("./output");
    }

    // Download video
    ytdl(videoUrl, { quality: "highest" })
      .pipe(fs.createWriteStream(outputPath))
      .on("finish", () => {
        console.log("Download completed.");
      });

    ctx.status = 200;
    ctx.body = `Video downloaded and saved`;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = "Error downloading video";
  }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
  console.log("server running on port 3000");
});
