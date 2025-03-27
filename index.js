// index.js
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/download', (req, res) => {
  const videoUrl = req.body.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  const command = `yt-dlp -x --audio-format mp3 -o audio.mp3 \"${videoUrl}\"`;
  console.log('Running command:', command);

  exec(command, (err) => {
    if (err) {
      console.error('yt-dlp failed:', err.message);
      return res.status(500).json({ error: err.message });
    }

    const filePath = path.join(__dirname, 'audio.mp3');
    res.sendFile(filePath);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
