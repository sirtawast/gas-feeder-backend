const logger = require("firebase-functions/logger");
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const {scraper, scraperSelectors} = require("./lib/scraper.js");

setGlobalOptions({region: "europe-west1"});

exports.gasFeederScrape = onRequest((request, response) => {
  const requestUrl = request.query.url;
  logger().info("Requesting: " + requestUrl);
  scraper(
      "https://muusikoiden.net/tori/" + requestUrl,
      ".tori-advert",
      scraperSelectors.body,
  )
      .paginate(scraperSelectors.pagination)
      .limit(4)
      .then((data) => {
        return response.send(data);
      }).catch((error) => {
        return response.send("ERROR: " + error);
      });
});
