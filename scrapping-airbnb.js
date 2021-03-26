const puppeteer = require('puppeteer-extra');
// const injectFile = require('puppeteer-inject-file');
puppeteer.use(require('puppeteer-extra-plugin-angular')());
const fs = require('fs');
const moment = require('moment');
const url = 'https://www.airbnb.com/rooms/44045890';
const scrapper = async () => {
    const browser = await puppeteer.launch({ headless: true, args: ["--window-size=1600,1000", '--no-sandbox'] });
    try {
        console.log('Scrapping Start!');
        console.time('Start');
        const page = await browser.newPage();
        await page.setViewport({ width: 1600, height: 700 });
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url, {
            waitUntil: 'networkidle0',
        });
        // await page.wait)
        let params = await page.url();
        params = params.split('?')[1];
        console.log(url, params);
        const json = {};
        json['name'] = await page.$eval('div[data-section-id="TITLE_DEFAULT"] section h1', e => e.innerText);
        const aggregate_score = await page.$eval('div[data-section-id="TITLE_DEFAULT"] section div:nth-child(2) div:nth-child(1) span:nth-child(1) a span', e => e.innerText);
        const total_reviews = await page.$eval('div[data-section-id="TITLE_DEFAULT"] section div:nth-child(2) div:nth-child(1) span:nth-child(3) span:nth-child(2)', e => e.innerText);

        json['reviews'] = {
            'aggregate_score': aggregate_score,
            total_reviews
        };

        json['image_url'] = await page.$eval('a[aria-label="Listing image 1, View all photos"] picture img', e => e.getAttribute('src'));

        const sleeps_max = await page.$eval('div[data-section-id="OVERVIEW_DEFAULT"] span:nth-child(1)', e => e.innerText);
        const beds = await page.$eval('div[data-section-id="OVERVIEW_DEFAULT"] span:nth-child(3)', e => e.innerText);
        const bedrooms = await page.$eval('div[data-section-id="OVERVIEW_DEFAULT"] span:nth-child(5)', e => e.innerText);
        const bathrooms = await page.$eval('div[data-section-id="OVERVIEW_DEFAULT"] span:nth-child(7)', e => e.innerText);

        json['room_types'] = {
            sleeps_max,
            beds,
            bedrooms,
            bathrooms
        };

        json['address'] = '';

        await page.clickIfExists(`a[href='/rooms/44045890/amenities?${params}']`, "check Click");
        await page.waitForSelector('div[aria-label="Amenities"]');
        const elements = await page.$$('div[aria-label="Amenities"] section div:nth-child(2) :only-child');
        // console.log(elements);
        let key = '';
        json['amenities'] = {};
        await Promise.all(elements.map(async element => {
            const tagName = await element.evaluate(e => e.tagName);
            const text = await element.evaluate(e => e.innerText);
            if (tagName === 'H3') {
                key = text;
                json['amenities'][key] = [];
            } else if (text) {
                json['amenities'][key].push(text);
            }
        }));

        await page.clickIfExists('div[aria-label="Amenities"] div[aria-label="Amenities"] div:nth-child(1) button[aria-label="Close"]', '');

        await page.clickIfExists(`a[href="/rooms/44045890/description?${params}"]`, '');
        await page.waitForSelector('div[aria-label="About this space"] div:nth-child(3) section div:nth-child(2) span span');
        const html = await page.$eval('div[aria-label="About this space"] div:nth-child(3) section div:nth-child(2) span span', e => e.innerHTML);

        json['description'] = html;

        json['updateAt'] = moment().format('YYYY-MM-DD hh:mm a');

        fs.writeFileSync('./data.json', JSON.stringify(json, null, 2));

        await browser.close();
        console.timeEnd('Start');
    } catch (error) {
        console.log(error);
        await browser.close();
    }
};

module.exports = scrapper;
