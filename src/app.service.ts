import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { log } from 'console';
const puppeteer = require('puppeteer-extra') 
 
// add stealth plugin and use defaults (all evasion techniques) 
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin()) 

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = require('selenium-webdriver/chrome');

@Injectable()
export class AppService {
  async visitPagePuppeteer(): Promise<void> {
    const browser = await puppeteer.launch({
      headless: false, // For debugging, set to true for production
      args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-blink-features=AutomationControlled'],
    });

   // const page = await browser.newPage();
   const page = await browser.newPage() 
   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0');
   await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
  });
   await page.goto('https://www.g2.com/products/asana/reviews') 
   await page.mouse.move(100, 100);
   await this.sleep(Math.random() * 200 + 1000)
   await page.mouse.move(320, 442);
    await page.mouse.click(100, 200);
   await this.sleep(Math.random() * 2000 + 1000)
   //await page.waitForTimeout(10000) 
    // Set a random User-Agent
    //await page.setUserAgent('Your random User-Agent string here');

    // Random delay before navigation
    //await page.waitForTimeout(Math.random() * 2000 + 1000);

    //await page.goto("https://search.censys.io", { waitUntil: 'networkidle2' });

    // const content = await page.content(); // Get page content
    // await this.sleep(10000)
    //await browser.close();
    //return content;
  }
  async visitPageSelenium () {
    // Set up Chrome options
    let options = new chrome.Options();
    options.addArguments(
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-gpu',
      '--disable-extensions'
    );
  
    // Set a random User-Agent
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');
  
    // Initialize WebDriver
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  
    try {
      // Visit the page
      await driver.get('https://www.g2.com/products/asana/reviews');
  
      // Wait for the page to load completely
      //await driver.wait(until.elementLocated(By.tagName('body')), 10000);
  
      // Perform actions like scrolling
     // await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
      // let actions = driver.actions({ async: true });
      // await actions.move({ x: 152, y: 230 }).perform(); 
      // await driver.sleep(2000);
      // await actions.move({ x: 152, y: 450 }).perform(); 
      //await actions.click().perform(); // Perform a click
      
      // Wait to mimic human interaction
      await driver.sleep(10000);
  
      // Get the page source or content
      let content = await driver.getPageSource();
      console.log(content);
  
    } catch (error) {
      console.error('Error visiting page:', error);
    } finally {
      // Quit the driver
      //await driver.quit();
    }
  }
  


  async callDriverless(args: string[] = [],render:boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('Calling driverless with args:', args);
      args.push(render.toString())
      const process = spawn('python', ['src/driverless.py', ...args]);

      let output = '';
      process.stdout.on('data', (data) => {
        output += data.toString();
        console.log(`Output: ${data}`);
        
      });

      process.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(`Process exited with code: ${code}`);
        }
      });
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
