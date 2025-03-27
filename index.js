const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/download', async (req, res) => {
  const videoUrl = req.body.url;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const filePath = path.join(__dirname, 'audio.mp4');

  try {
    const stream = ytdl(videoUrl, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    const file = fs.createWriteStream(filePath);
    stream.pipe(file);

    file.on('finish', () => {
      res.sendFile(filePath);
    });

    file.on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to write file' });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
