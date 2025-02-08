# 🎲 MagicNewton Dice Bot

A simple Puppeteer bot to automate rolling dice on [MagicNewton](https://magicnewton.com/portal?referral=qw3lcv03mjqffoqu). The bot logs in using session cookies and attempts to roll the dice whenever it's available.

## 🚀 Features
- **Automated Dice Rolling:** 
- **Credit & Email Display:** 
- **Smart Timer:** 
- **Runs in a Loop every 24 hours**

## ✨ DONT FORGET TO FOLLOW AND SHOW YOUR SUPPORT WITH A STAR

## 🛠️ Installation

### 1️⃣ Clone the repository
```sh
git clone https://github.com/hardeeps647/magicnewton-bot.git 
cd magicnewton-bot
```

### 2️⃣ Install dependencies
```sh
npm install puppeteer
```

### 3️⃣ Get Your Session Cookies
You need session cookies to stay logged in. Here's how to get them:

![MagicNewton Dice Bot](https://raw.githubusercontent.com/hardeeps647/magicnewton-bot/main/hgfdfgh.PNG)

1. Open **MagicNewton** in Chrome.
2. Press `F12` or `Ctrl + Shift + I` to open DevTools.
3. Go to the **Application** tab → **Storage** → **Cookies**.
4. Look for the cookie named __Secure-next-auth.session-token.
5. Copy its value.

### 4️⃣ Edit **Cookies.json** file (To save, Edit, CTRL+X , Y, Then, Enter)

```sh
nano cookies.json
```
![MagicNewton Dice Bot](https://raw.githubusercontent.com/hardeeps647/magicnewton-bot/main/FDGSFGED.PNG)

### 5️⃣ Run the bot
```sh
node bot.js
```

## ***Updating the Bot***

To update the bot with the latest changes, run:
```sh
git pull
```

## ***After updating, restart the bot using:***
```sh
node bot.js
```
  
## 📌 Notes
- The bot runs **headless** (in the background). Change `headless: true` to `headless: false` if you want to see the browser.
- If the "Roll" button isn't available, the bot will wait and display the countdown timer.
- **Use at your own risk.** Automating websites might go against their terms of service.

## 📝 License
This project is for educational purposes only. Use responsibly.
