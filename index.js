const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/download', (req, res) => {
  const videoUrl = req.body.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing video URL in body' });
  }

  console.log(`Downloading: ${videoUrl}`);

  const outputFile = path.join(__dirname, 'audio.mp3');

  exec(`yt-dlp -x --audio-format mp3 -o "${outputFile}" ${videoUrl}`, (err) => {
    if (err) {
      console.error('Download error:', err.message);
      return res.status(500).json({ error: 'Failed to download audio' });
    }

    res.download(outputFile, 'audio.mp3', (err) => {
      if (err) {
        console.error('Send file error:', err.message);
        res.status(500).json({ error: 'Failed to send file' });
      }
    });
  });
});

app.get('/', (req, res) => {
  res.send('Server is running ✔️');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
