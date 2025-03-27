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

  const command = `yt-dlp -x --audio-format mp3 -o audio.mp3 "${videoUrl}"`;

  exec(command, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const filePath = path.join(__dirname, 'audio.mp3');
    res.sendFile(filePath);
  });
});

// ✅ חשוב: מאזין לפורט שמוגדר ע"י רנדר
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
