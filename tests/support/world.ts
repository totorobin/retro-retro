import { Before, After, World, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import axios from 'axios';

setDefaultTimeout(30000);

class CustomWorld extends World {
  browser?: Browser;
  page?: Page;
  webUrl: string = 'http://localhost:3000';
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  // Clear DB before each scenario
  await axios.post('http://localhost:4000/api/test/clear-db').catch(() => {});
  
  // Si on vient de démarrer les services, on attend un peu qu'ils soient stables
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  this.browser = await chromium.launch({ headless: true });
  this.page = await this.browser.newPage();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.browser?.close();
});
