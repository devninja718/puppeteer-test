const puppeteer = require('puppeteer-extra');
// const injectFile = require('puppeteer-inject-file');
puppeteer.use(require('puppeteer-extra-plugin-angular')());
const fs = require('fs');
const moment = require('moment');
const url = 'https://www.booking.com/hotel/us/big-bear-lake-40472-big-bear-boulevard.html';
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
        
        const json = {};

        json['name'] = await page.$eval('h2#hp_hotel_name', e => e.innerHTML);
        json['name'] = json.name.split('\n')[2];

        json['address'] = await page.$eval('span.hp_address_subtitle', e => e.innerText);

        const description = await page.$$eval('.hp_desc_main_content #summary p', e => e.map(item => item.innerText));
        json['description'] = description.join('\n');

        const images = await page.$$eval('div.clearfix.bh-photo-grid.bh-photo-grid--space-down.fix-score-hover-opacity img', e => e.map(item => item.getAttribute('src')));
        json['image_urls'] = images.filter(item => item != null && !item.includes('.png'));

        const maxs = await page.$$eval('.roomstable tbody tr span.bui-u-sr-only', e => e.map(item => item.innerText))
        const beds = await page.$$eval('div.bed-types-wrapper ul.rt-bed-types', e => e.map(item => item.innerText));

        const aggregate_score = await page.$eval('div.bui-review-score__badge', e => e.innerText);
        const total_reviews = await page.$eval('div.bui-review-score__text', e => e.innerText);

        json['reviews'] = {
            aggregate_score,
            total_reviews
        }

        json['rooms_type'] = maxs.map((item, index) => {
            return {
                sleeps_max: item.split('Max adults: ')[1],
                beds: beds[index].trim()
            }
        })

        const elements = await page.$$('div.facilitiesChecklistSection');
        json['amenities'] = {};
        let key = '';
        console.log(elements.length);
        await Promise.all(elements.map(async element => {
            key = await element.$eval('h5', e => e.innerText);
            json['amenities'][key] = await element.$$eval('ul li', e => e.map(ele => ele.innerText))
        }))


        console.log(json);

        json['updateAt'] = moment().format('YYYY-MM-DD hh:mm a');
        fs.writeFileSync('./data-book.json', JSON.stringify(json, null, 2));

        await browser.close();
        console.timeEnd('Start');
    } catch (error) {
        console.log(error);
        await browser.close();
    }
};

module.exports = scrapper;
