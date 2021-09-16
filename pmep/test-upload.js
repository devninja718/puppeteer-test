const puppeteer = require('puppeteer-extra');
// const injectFile = require('puppeteer-inject-file');
puppeteer.use(require('puppeteer-extra-plugin-angular')());
const fs = require('fs');
const moment = require('moment');
const url = 'http://localhost:3000';

const scrapper = async () => {
    const browser = await puppeteer.launch({ headless: true, args: ["--window-size=1600,1000", '--no-sandbox'] });
    const json = {};
    try {
        console.log('Scrapping Start!');
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1600, height: 700 });
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url, {
            waitUntil: 'networkidle0',
        });

        await page.waitForSelector('div[data-prop="username"] input[type="email"]');
        await page.type('div[data-prop="username"] input[type="email"]', 'superadmin@signalinfra.com', { delay: 10 });
        await page.type('div[data-prop="password"] input[type="password"]', 'niceWorld2021!', { delay: 10 });
        // await page.clickIfExists(`button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.jss14.MuiButton-containedSizeLarge.MuiButton-sizeLarge`, "check Click");
        await page.clickIfExists(`button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MySignIn-loginButton-14.MuiButton-containedSizeLarge.MuiButton-sizeLarge`, "check Click");
        await page.waitForSelector('.menu-Lessons');
        await page.clickIfExists('.menu-Lessons');

        await page.waitForSelector('#testclass1');
        await page.clickIfExists(`#testclass${1}`);

        for (let j = 44; j <= 500; j++) {
            console.time('Start' + j);
            try {
                
                await page.waitForSelector('#testLesson1-' + j);
                await page.clickIfExists('#testLesson1-' + j);

                await page.waitForTimeout(1000);

                const elementHandle = await page.$('div[style="padding: 10px; background: rgb(255, 255, 255); display: unset;"] input[type="file"]');
                await elementHandle.uploadFile('./result.json');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);

                await elementHandle.uploadFile('./attachment1.pdf');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment2.pdf');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment3.pdf');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment4.pdf');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment5.webm');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment6.jpg');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment7.jpg');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment8.jpg');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);
                await elementHandle.uploadFile('./attachment9.jpg');
                
                await page.waitForSelector('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button:nth-child(2)');
                await page.waitForTimeout(2000);

                console.log('Finished Lesson1-', j)
                
                json[j] = true;

                fs.writeFileSync('result.json', JSON.stringify(json, null, 2))
                console.timeEnd('Start' + j);
            } catch (error) {
                console.log(j, error.message)
            }
        }
        
    } catch (error) {
        console.log(error);
        await browser.close();
    } finally {
        fs.writeFileSync('result.json', JSON.stringify(json, null, 2))
    }
};

scrapper();