/* eslint-disable require-jsdoc */
const xray = require("x-ray");
const iso885915 = require("iso-8859-15");
const request = require("request");

function prepareXray() {
  const scraper = xray({
    filters: {
      formatImageFull: function(value) {
        return typeof value === "string" &&
          (value.indexOf("-q.jpg") > 0 || value.indexOf("-n.jpg") > 0) ?
          value.replace(/-[a-z]\.jpg/gi, ".jpg") :
          value;
      },
      formatPrice: function(value) {
        return typeof value === "string" ? value.replace("Hinta: ", "") : value;
      },
      formatId: function(value) {
        return typeof value === "string" ?
          parseInt(value.split("/ilmoitus/")[1]) :
          value;
      },
    },
  });

  const driver = function driver(context, callback) {
    const convert = function(body) {
      // eslint-disable-next-line new-cap
      const bufferedBody = new Buffer.from(body, "binary").toString("binary");
      return iso885915.decode(bufferedBody);
    };

    const options = {gzip: true, encoding: null};
    request.get({uri: context.url, ...options}, (err, _, body) => {
      if (!err) body = convert(body);
      return callback(err, body);
    });
  };

  scraper.driver(driver);
  return scraper;
}

const scraper = prepareXray();

module.exports = scraper;
