const { chromium } = require('playwright');

(async () => {

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/view',
  '/login',
  '/register',
  '/forgot-password'
];

for (const route of publicRoutes) {
  await page.goto(`http://localhost:3000${route}`);
  await page.waitForTimeout(2000);

  const name = route === '/' ? 'landing' : route.replace('/', '');

  await page.screenshot({
    path: `client-demo-ss/public-${name}.png`,
    fullPage: true
  });
}

// -------- PUBLIC VIEW PAGES --------

await page.goto('http://localhost:3000/view/club/fc9e6a73-74f9-4ea3-a738-9f40a5b94334');
await page.waitForTimeout(2000);

await page.screenshot({
  path: 'client-demo-ss/public-view-club.png',
  fullPage: true
});

await page.goto('http://localhost:3000/view/company/09cd0484-598e-43c6-82f6-bae4d125d7f4');
await page.waitForTimeout(2000);

await page.screenshot({
  path: 'client-demo-ss/public-view-company.png',
  fullPage: true
});

  // ---------------- LOGIN ----------------
  await page.goto('http://localhost:3000/login');

  await page.waitForSelector('input[placeholder="you@example.com"]');

  await page.fill(
    'input[placeholder="you@example.com"]',
    'test@club.com'
  );

  await page.fill(
    'input[type="password"]',
    '12345678'
  );

  await page.click('button:has-text("Sign In")');

await page.waitForURL('**/dashboard');

  // --------------- CLUB PAGES ---------------

  const clubRoutes = [
    '/club/dashboard',
    '/club/events',
    '/club/profile',
    '/club/sponsorships'
  ];

  for (const route of clubRoutes) {
    await page.goto(`http://localhost:3000${route}`);
    await page.waitForTimeout(2000);

    const name = route.split('/').pop();

    await page.screenshot({
      path: `client-demo-ss/club-${name}.png`,
      fullPage: true
    });
  }

  // -------- DESTROY SESSION --------

const context = page.context();
await context.clearCookies();

await page.goto('http://localhost:3000/login');
await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/login');

  await page.waitForSelector('input[placeholder="you@example.com"]');

  await page.fill(
    'input[placeholder="you@example.com"]',
    'test@company.com'
  );

  await page.fill(
    'input[type="password"]',
    '12345678'
  );

  await page.click('button:has-text("Sign In")');

await page.waitForURL('**/dashboard');
  // --------------- COMPANY PAGES ---------------

  const companyRoutes = [
    '/company/dashboard',
    '/company/discover',
    '/company/profile',
    '/company/sponsorships'
  ];

  for (const route of companyRoutes) {
    await page.goto(`http://localhost:3000${route}`);
    await page.waitForTimeout(2000);

    const name = route.split('/').pop();

    await page.screenshot({
      path: `client-demo-ss/company-${name}.png`,
      fullPage: true
    });
  }

  console.log("✅ All SponsorBridge screenshots taken");

  await browser.close();

})();