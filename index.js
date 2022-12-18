import puppeteer from "puppeteer";

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const currentUrl = "https://ria.ru/lenta/";

  await page.goto(currentUrl);

  await page.waitForSelector(".list");

  const result = await page.evaluate(() => {
    let dataSrc = [];
    let elements = document.querySelectorAll(".list-item");
    for (let element of elements) {
      dataSrc.push(
        element.querySelector(".list-item__title").getAttribute("href")
      );
    }
    return dataSrc;
  });
  await browser.close();
  return result;
};

const scrapeNews = async (urls) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let data = [];
  for (let url of urls.slice()) {
    await page.goto(url);

    await page.waitForSelector(".article").then(() => console.log(url));

    const result = await page.evaluate(() => {
      let texts = Array.from(document.querySelectorAll(".article__text"));
      let photoviewOpen = document.querySelector(".photoview__open");
      let data = {
        title: document.querySelector(".article__title")?.innerText ,
        subtitle:
          document.querySelector(".article__second-title")?.innerText,
        img: photoviewOpen.querySelector("img").getAttribute("src"),
        dateInfo:
          document.querySelector(".article__info-date")?.innerText,
        text: [],
      };
      texts.forEach((item) => data.text.push(item?.innerText));
      return data;
    });
    data.push(result);
  }
  await browser.close();
  return data;
};

const getNews = async () => {
  const newsUrl = await scrape();

  const data = await scrapeNews(newsUrl);
  return data;
};

const news = await getNews();

console.log(news);
