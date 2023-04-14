// This test case spec contains everything needed to run a full visual test against the ACME bank site.
// It runs the test once locally, and then it performs cross-browser testing against multiple unique browsers in Applitools Ultrafast Grid.

import { test } from '@playwright/test';
import { BatchInfo, Configuration, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target } from '@applitools/eyes-playwright';

// Applitools objects to share for all tests
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: VisualGridRunner;

// This method sets up the configuration for running visual tests in the Ultrafast Grid.
// The configuration is shared by all tests in a test suite, so it belongs in a `beforeAll` method.
// If you have more than one test class, then you should abstract this configuration to avoid duplication.
test.beforeAll(async () => {

  // Create the runner for the Ultrafast Grid.
  // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
  // Warning: If you have a free account, then concurrency will be limited to 1.
  Runner = new VisualGridRunner({ testConcurrency: 5 });

  // Create a new batch for tests.
  // A batch is the collection of visual checkpoints for a test suite.
  // Batches are displayed in the Eyes Test Manager, so use meaningful names.
  Batch = new BatchInfo({ name: 'Example: Playwright TypeScript with the Ultrafast Grid' });

  // Create a configuration for Applitools Eyes.
  Config = new Configuration();

  // Set the batch for the config.
  Config.setBatch(Batch);

  // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
  // Other browsers are also available, like Edge and IE.
  Config.addBrowser(800, 600, BrowserType.CHROME);
  Config.addBrowser(1600, 1200, BrowserType.FIREFOX);
  Config.addBrowser(1024, 768, BrowserType.SAFARI);

  // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
  // Other mobile devices are available, including iOS.
  Config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
  Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
});

// This "describe" method contains related test cases with per-test setup and cleanup.
// In this example, there is only one test.
test.describe('ACME Bank', () => {

  // Test-specific objects
  let eyes: Eyes;

  // This method sets up each test with its own Applitools Eyes object.
  test.beforeEach(async ({ page }) => {

    // Create the Applitools Eyes object connected to the VisualGridRunner and set its configuration.
    eyes = new Eyes(Runner, Config);
    eyes.setApiKey('oLvO7JhaKPnK109UysjK37hO5TN8IvS22MvNR0kWN2107yA110');
    eyes.setServerUrl('https://eyes.applitools.com');
    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    // It is a recommended practice to set all four inputs below:
    await eyes.open(

      // The Playwright page object to "watch"
      page,

      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      'ACME Bank',

      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin"). 
      test.info().title,

      // The viewport size for the local browser.
      // Eyes will resize the web browser to match the requested viewport size.
      // This parameter is optional but encouraged in order to produce consistent results.
      { width: 1024, height: 768 }, { width: 1280, height: 720 });
  });

  // This test covers login for the Applitools demo site, which is a dummy banking app.
  // The interactions use typical Playwright calls,
  // but the verifications use one-line snapshot calls with Applitools Eyes.
  // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
  // Traditional assertions that scrape the page for text values are not needed here.
  test('log into a bank account', async ({ page }) => {

    // Load the login page.

    // Verify the full login page loaded correctly.
    await page.goto('https://hoclieu.vn/skill/96534121-d1fe-484f-9285-38a10a1f5161?lessonId=08db25b8-306f-4673-8eb0-5ecb903e4c30');
    await page.locator('.question-fill-in').first().fill('ksajdksajdksajdaskjdsalklda');

    await page.locator('div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span > .question-fill-in').fill('lksdlaskdlsakdlsakdlaskdadka;');

    await page.locator('div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > span > .question-fill-in').fill('aslkdals;kdsalkdas;lkdasl;dkas');

    await page.locator('.template-box > div:nth-child(2) > div > span > .question-fill-in').fill('sad;l;sald;asld;saldas\';ldas;\'ldsa;\'ldsa\';dlas;\'dlsa;dlas;\'dlas;\'dlas;\'dla;dlas\'');

    await page.locator('div:nth-child(3) > div:nth-child(2) > span > .question-fill-in').fill('adlsakdas;dkasldkas;ldkas;ldkas;ldkas;ld');

    // Verify the full main page loaded correctly.
    // This snapshot uses LAYOUT match level to avoid differences in closing time text.
    await eyes.check('Main page', Target.window().fully().layout());
  });

  // This method performs cleanup after each test.
  test.afterEach(async ({page}) => {

    // Close Eyes to tell the server it should display the results.
    await eyes.close();
    await page.waitForTimeout(12000);
    // Warning: `eyes.closeAsync()` will NOT wait for visual checkpoints to complete.
    // You will need to check the Eyes Test Manager for visual results per checkpoint.
    // Note that "unresolved" and "failed" visual checkpoints will not cause the Playwright test to fail.

    // If you want the Playwright test to wait synchronously for all checkpoints to complete, then use `eyes.close()`.
    // If any checkpoints are unresolved or failed, then `eyes.close()` will make the Playwright test fail.
  });
});

test.afterAll(async () => {

  // Close the batch and report visual differences to the console.
  // Note that it forces Playwright to wait synchronously for all visual checkpoints to complete.
  const results = await Runner.getAllTestResults();
  console.log('Visual test results', results);
});
