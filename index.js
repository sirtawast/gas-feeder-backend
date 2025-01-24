const xray = require("x-ray");
const iconvlite = require('iconv-lite');
const request = require("request");

function prepareXray() {
  const scraper = xray({
    filters: {
      formatImageFull: function (value) {
        return typeof value === "string" &&
          (value.indexOf("-q.jpg") > 0 || value.indexOf("-n.jpg") > 0)
          ? value.replace(/-[a-z]\.jpg/gi, ".jpg")
          : value;
      },
      formatPrice: function (value) {
        return typeof value === "string" ? value.replace("Hinta: ", "") : value;
      },
      formatId: function (value) {
        return typeof value === "string"
          ? parseInt(value.split("/ilmoitus/")[1])
          : value;
      },
    },
  });
  
  const driver = function driver(context, callback) {
    const convert = function (body) {
      const bufferedBody = new Buffer.from(body, 'binary')
      return iconvlite.decode(bufferedBody, "ISO-8859-15");
    };
  
    const options = { gzip: true, encoding: null}
    request.get({uri: context.url, ...options}, function (err, _, body) {
      if (!err) body = convert(body);
      return callback(err, body);
    });
  };
  
  scraper.driver(driver);
  return scraper;
}

const scraper = prepareXray();
const url = "https://muusikoiden.net/tori/?category=87";

scraper(
  url,
  ".tori-advert",
  [
    {
      id: "tr:nth-child(1) a@href | formatId",
      link: "tr:nth-child(1) a@href",
      title: "tr:nth-child(1) a",
      desc: ".msg",
      price: ".msg+br+br+b | formatPrice",
      img: ".tori-thumb@src",
      imgFull: ".tori-thumb@src | formatImageFull",
    },
  ]
).write("results.json");
