import puppeteer from "puppeteer";
const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://ria.ru/lenta/');
    await page.waitForSelector('.list-item__title');
    await page.waitForSelector('.list-item__image');
    const result = await page.evaluate(() => {
        let dataSrc = [];
        let elements = document.querySelectorAll('.list-item');
        for (let element of elements) {
            dataSrc.push(element.querySelector('.list-item__title').getAttribute("href"));
        }
        return dataSrc;
    });
    return result;
};

const scrapeNews = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setDefaultNavigationTimeout(1000);
    await page.waitForSelector('.article');
    const result = await page.evaluate(() => {
        let texts = Array.from(document.querySelectorAll('.article__text'));
        let photoviewOpen = document.querySelector('.photoview__open')
        let data = {
            title: document.querySelector('.article__title').innerText,
            subtitle: document.querySelector('.article__second-title').innerText,
            img: photoviewOpen.querySelector("img").getAttribute("src"),
            dateInfo: document.querySelector('.article__info-date').innerText,
            text: [],
        };
        texts.forEach(item => data.text.push(item.innerText))
        return data;
    });
    return result;
}


const getNews = async () => {
    const newsUrl = await scrape();
    const data = [];
    for(let item of newsUrl) {
        let news = await scrapeNews(item);
        data.push(news)
    }
    return data;
};

const news = await getNews();

console.log(news)


