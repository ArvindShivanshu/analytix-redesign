const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
  const outDir = path.join(__dirname, '../docs/snapshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  // 1. Hero 3D CAD Assembly at start
  console.log('Capturing Hero 3D CAD...');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '01_hero_cad_digital_twin.png') });

  // 2. 3D CAD Working Simulation (scrolling to phase 3/4)
  console.log('Capturing 3D CAD Working Simulation...');
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 1.8, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '02_cad_simulation_actuation.png') });

  // 3. Timeline Corridor
  console.log('Capturing Timeline Corridor...');
  await page.evaluate(() => {
    const el = document.getElementById('timeline');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '03_timeline_corridor.png') });

  // 4. Challenge Mandates
  console.log('Capturing Challenge Mandates...');
  await page.evaluate(() => {
    const el = document.getElementById('mandates');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '04_challenge_mandates.png') });

  // 5. Subsystems Architecture
  console.log('Capturing Subsystems Architecture...');
  await page.evaluate(() => {
    const el = document.getElementById('subsystems');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_subsystem_architecture.png') });

  // 6. Engineers Roster
  console.log('Capturing Engineers Roster...');
  await page.evaluate(() => {
    const el = document.getElementById('team');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '06_engineers_roster.png') });

  // 7. Media Gallery
  console.log('Capturing Media Gallery...');
  await page.evaluate(() => {
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_media_gallery.png') });

  // 8. Technical Footer
  console.log('Capturing Technical Footer...');
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '08_portal_footer.png') });

  console.log('All snapshots captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Snapshot capture failed:', err);
  process.exit(1);
});
