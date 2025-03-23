# שלב א: תמונת בסיס - Node
FROM node:16

# שלב ב: להתקין Python ו-pip
RUN apt-get update && apt-get install -y python3 python3-pip

# שלב ג: להתקין yt-dlp
RUN pip3 install yt-dlp

# יצירת תיקייה /app והגדרת WORKDIR
WORKDIR /app

# העתקת קבצי הפרויקט ל-/app
COPY . .

# התקנת התלויות של Node מתוך package.json
RUN npm install

# חשיפת פורט 3000 (אופציונלי)
EXPOSE 3000

# הפקודה שתורץ כשנדליק את הקונטיינר
CMD ["npm", "start"]
