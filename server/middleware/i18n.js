const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const path = require("path");
const { PassThrough } = require("stream");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "te", "hi"], // languages you support
    backend: {
      loadPath: PassThrough.join(path.resolve(__dirname, "../../locales/{{lng}}/translation.json")),
    },
  });

module.exports = middleware.handle(i18next);
