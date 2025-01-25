const { scraper, scrapeSelectors } = require("./functions/lib/scraper.js");

scraper(
    "https://muusikoiden.net/tori/?category=112",
    ".tori-advert",
    scrapeSelectors.body
)
    .paginate(scrapeSelectors.pagination)
    .limit(1)
    .then((data) => {
      console.log(data)
    }).catch((error) => {
      return response.send("ERROR: " + error);
    });