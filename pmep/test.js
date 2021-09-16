const puppeteer = require('puppeteer-extra');
// const injectFile = require('puppeteer-inject-file');
puppeteer.use(require('puppeteer-extra-plugin-angular')());
const fs = require('fs');
const moment = require('moment');
const url = 'http://localhost:3000';

const scrapper = async () => {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1600,1000", '--no-sandbox'] });
    const json = {};
    try {
        console.log('Scrapping Start!');
        console.time('Start');
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
        for (let i = 42; i <= 100; i++) {
            try {
                await page.waitForSelector('#TestSchool');
                await page.clickIfExists('#TestSchool div div.MuiTypography-root.MuiTreeItem-label.makeStyles-label-171.MuiTypography-body1 div');
                await page.waitForTimeout(1000);
                await page.clickIfExists('#newButton');

                await page.type('.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-fullWidth.MuiInputBase-formControl.MuiInputBase-marginDense.MuiOutlinedInput-marginDense[style="font-size: 14px;"] input', 'test class' + i, { delay: 10 });

                await page.clickIfExists('.MuiDialogActions-root.MuiDialogActions-spacing button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary')
            } catch (error) {
                console.log(error)
            }
            // await page.waitForSelector('#back-to-top-anchor button[tabindex="0"]');
        }
        // await page.clickIfExists(`#back-to-top-anchor button[tabindex="0"]`, "dropdown Click");
        // await page.clickIfExists(`#customized-menu ul[role="menu"] li:nth-child(2)`, "logout Click");

        console.timeEnd('Start');
    } catch (error) {
        console.log(error);
        await browser.close();
    } finally {
        fs.writeFileSync('result.json', JSON.stringify(json, null, 2))
    }
};

scrapper();