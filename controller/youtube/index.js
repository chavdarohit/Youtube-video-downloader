import ytdl from "ytdl-core";
import fs from "fs";

export const downloadYtVideo = async (ctx)=>{
    try {
        let {videoId} = ctx.state.shared
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
}
