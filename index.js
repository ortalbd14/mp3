const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/download', (req, res) => {
  const videoUrl = req.body.url;
  if (!videoUrl) return res.status(400).json({ error: 'Missing video URL' });

  exec(`yt-dlp -x --audio-format mp3 -o audio.mp3 ${videoUrl}`, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.sendFile(__dirname + '/audio.mp3');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
