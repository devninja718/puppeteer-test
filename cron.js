const CronJob = require('cron').CronJob;
const scrapperAir = require('./scrapping-airbnb');
const scrapperBook = require('./scrapping-book');

class Cron {
    init() {
        this.startScrapping();
    };

    startScrapping() {
        const job = new CronJob('0 */15 * * * *', async () => {
            await scrapperAir();

            await scrapperBook();
        }, null, true);
        console.log('Cron Job Start ', job.running);
    }
}

module.exports = new Cron();