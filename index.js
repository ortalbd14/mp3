const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const videoUrl = req.body.url;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const filePath = path.join(__dirname, 'audio.mp3');
    const stream = ytdl(videoUrl, { filter: 'audioonly' });
    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);

    writeStream.on('finish', () => {
      res.sendFile(filePath);
    });

    writeStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ error: 'Failed to write audio file' });
    });
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download audio' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
