import Koa from "koa";
import Router from "koa-router";
import cors from "koa-cors";
import ytdl from "ytdl-core";
import fs from "fs";
import path from "path";
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
    const regex = /^.*(youtu.be\/|youtube(-nocookie)?.com\/(v\/|.*u\/\w\/|embed\/|.*v=))([\w-]{11}).*/;
    const match = url.match(regex);
    return match ? match[4] : null;
}

  const videoId = extractVideoId(URL);
  if (!videoId) {
    ctx.status = 400;
    ctx.body = "Invalid YouTube URL";
    return;
  }

  try {
    // Fetch video info using the extracted videoId
    const info = await ytdl.getInfo(videoId);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, ""); // Sanitize title
    const filename = `${title}.mp4`;
    const filePath = path.join(__dirname, filename);

    // Create a write stream
    const writeStream = fs.createWriteStream(filePath);

    // Stream the video to a file
    ytdl(`https://www.youtube.com/watch?v=${videoId}`, { format: "mp4" }).pipe(
      writeStream
    );

    ctx.status = 200;
    ctx.body = `Video downloaded and saved as ${filename}`;
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Error downloading video";
  }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
  console.log("server running on port 3000");
});
