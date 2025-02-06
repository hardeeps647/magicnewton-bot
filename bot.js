const puppeteer = require('puppeteer');
const fs = require('fs');

console.log(`
  ██████╗ ███████╗███████╗██████╗ 
  ██╔══██╗██╔════╝██╔════╝██╔══██╗
  ██║  ██║█████╗  █████╗  ██████╔╝
  ██║  ██║██╔══╝  ██╔══╝  ██╔═══╝ 
  ██████╔╝███████╗███████╗██║     
  ╚═════╝ ╚══════╝╚══════╝╚═╝     
  `);

  console.log(`
    ██████╗ ██╗  ██╗ █████╗ ██╗     ██╗██╗    ██╗ █████╗ ██╗     
    ██╔══██╗██║  ██║██╔══██╗██║     ██║██║    ██║██╔══██╗██║     
    ██║  ██║███████║███████║██║     ██║██║ █╗ ██║███████║██║     
    ██║  ██║██╔══██║██╔══██║██║     ██║██║███╗██║██╔══██║██║     
    ██████╔╝██║  ██║██║  ██║███████╗██║╚███╔███╔╝██║  ██║███████╗
    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝
    `);
    console.log(`****Created by Hardeep****`);  
    
const MAGICNEWTON_URL = "https://www.magicnewton.com/portal/rewards";
const DEFAULT_SLEEP_TIME = 24 * 60 * 60 * 1000; // 24 hours
const RANDOM_EXTRA_DELAY = () => Math.floor(Math.random() * (60 - 20 + 1) + 20) * 60 * 1000; // 20-60 mins random delay

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseTimeString(timeStr) {
  const parts = timeStr.split(':').map(Number);
  if (parts.length !== 3) return null;
  return {
    hours: parts[0],
    minutes: parts[1],
    seconds: parts[2],
    totalMs: (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000
  };
}

async function showLiveCountdown(totalMs) {
  while (totalMs > 0) {
    console.clear();
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
    console.log(`⏳ Next roll available in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} `);
    await delay(1000);
    totalMs -= 1000;
  }
  console.log("\n✅ Time reached! Retrying roll...");
}

(async () => {
  console.log("🚀 Starting Puppeteer Bot...");

  while (true) {
    try {
      console.clear();
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();

      if (fs.existsSync('cookies.json')) {
        const cookies = JSON.parse(fs.readFileSync('cookies.json'));
        await page.setCookie(...cookies);
        console.log("✅ Cookies loaded successfully. \n⏳ Webpage Loading: may take up to 60 secs...");
      } else {
        console.log("❌ Cookies file not found. Please run the login step first.");
        await browser.close();
        return;
      }

      await page.goto(MAGICNEWTON_URL, { waitUntil: 'networkidle2', timeout: 60000 });
      console.log("🌐 Page loaded.");

      const userEmail = await page.$eval('p.gGRRlH.WrOCw.AEdnq.hGQgmY.jdmPpC', el => el.innerText).catch(() => 'Unknown');
      console.log(`📧 Logged in as: ${userEmail}`);

      let userCredits = await page.$eval('#creditBalance', el => el.innerText).catch(() => 'Unknown');
      console.log(`💰 Current Credits: ${userCredits}`);

      await page.waitForSelector('button', { timeout: 30000 });
      const rollNowClicked = await page.$$eval('button', buttons => {
        const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Roll now"));
        if (target) {
          target.click();
          return true;
        }
        return false;
      });

      if (rollNowClicked) {
        console.log("✅ 'Roll now' button clicked!");
      }
      await delay(5000);

      const letsRollClicked = await page.$$eval('button', buttons => {
        const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Let's roll"));
        if (target) {
          target.click();
          return true;
        }
        return false;
      });

      if (letsRollClicked) {
        console.log("✅ 'Let's roll' button clicked!");
        await delay(5000);
        const throwDiceClicked = await page.$$eval('button', buttons => {
          const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Throw Dice"));
          if (target) {
            target.click();
            return true;
          }
          return false;
        });

        if (throwDiceClicked) {
          console.log("✅ 'Throw Dice' button clicked!");
          console.log("⏳ Waiting 20 seconds for dice animation...");
          await delay(20000);
          userCredits = await page.$eval('#creditBalance', el => el.innerText).catch(() => 'Unknown');
          console.log(`💰 Updated Credits: ${userCredits}`);
        } else {
          console.log("⚠️ 'Throw Dice' button not found.");
        }
      } else {
        console.log("👇 Wait! ROLL not available yet. ");
        const timerText = await page.evaluate(() => {
          const h2Elements = Array.from(document.querySelectorAll('h2'));
          for (let h2 of h2Elements) {
            const text = h2.innerText.trim();
            if (/^\d{2}:\d{2}:\d{2}$/.test(text)) {
              return text;
            }
          }
          return null;
        });

        if (timerText) {
          console.log(`⏱ Time Left until next ROLL: ${timerText}`);
          const timeData = parseTimeString(timerText);
          if (timeData) {
            await showLiveCountdown(timeData.totalMs + 5000);
          } else {
            console.log("⚠️ Failed to parse timer. Using default sleep time.");
          }
        } else {
          console.log("⚠️ No timer found. Using default sleep time.");
        }
      }
      await browser.close();

      const extraDelay = RANDOM_EXTRA_DELAY();
      console.log(`🔄 Cycle complete. Sleeping for 24 hours + random delay of ${extraDelay / 60000} minutes...`);
      await delay(DEFAULT_SLEEP_TIME + extraDelay);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  }
})();
