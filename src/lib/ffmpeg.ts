import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const transcodeToHLS = (inputPath: string, outputDir: string, videoId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hlsDir = path.join(outputDir, videoId);
    if (!fs.existsSync(hlsDir)) {
      fs.mkdirSync(hlsDir, { recursive: true });
    }

    const playlistPath = path.join(hlsDir, "playlist.m3u8");

    ffmpeg(inputPath)
      .outputOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls"
      ])
      .output(playlistPath)
      .on("end", () => {
        console.log(`Transcoding finished for ${videoId}`);
        resolve(path.join("processed", videoId, "playlist.m3u8"));
      })
      .on("error", (err) => {
        console.error(`Transcoding error for ${videoId}:`, err);
        reject(err);
      })
      .run();
  });
};

export const generateThumbnail = (inputPath: string, outputDir: string, videoId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const thumbName = `${videoId}-thumb.jpg`;
    const thumbPath = path.join(outputDir, thumbName);

    ffmpeg(inputPath)
      .screenshots({
        timestamps: ["00:00:02"],
        filename: thumbName,
        folder: outputDir,
        size: "1280x720"
      })
      .on("end", () => {
        resolve(path.join("processed", thumbName));
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};
