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
    return res.status(400).json({ error: 'לא סופק url' });
  }

  const command = `python3 -m yt_dlp -x --audio-format mp3 -o audio.mp3 ${videoUrl}`;

  exec(command, (err) => {
    if (err) {
      console.error('שגיאה בהרצת yt-dlp:', err);
      return res.status(500).json({ error: err.message });
    }
    const filePath = path.join(__dirname, 'audio.mp3');
    res.sendFile(filePath, (error) => {
      if (error) {
        console.error('שגיאה בשליחת הקובץ:', error);
        return res.status(500).send('Error sending file');
      }
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
