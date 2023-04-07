require("dotenv").config();

module.exports = Object.freeze({
    dbName: process.env.DBNAME || "mongodb",
    PORT: (process.env.PORT && +process.env.PORT) || 3000,
    mongodbUriConnection:
        process.env.MONGOUriConnection || "mongodb://localhost:27017/test-db",
    twitterSelector:
        process.env.twitterSELECTOR ||
        "body > div.content-top.px1.py075 > div > div:nth-child(2) > div.md-col.md-col-9.col-12.mt075 > div > div.md-col.md-col-6.col-12.md-pl3 > div:nth-child(1) > span",
    facebookSelector:
        process.env.facebookSELECTOR ||
        "body > div:nth-child(13) > div:nth-child(1) > div:nth-child(2) > p:nth-child(8)",
    instagramSelector:
        process.env.instagramSELECTOR ||
        "div > div.app-content.content > div.content-wrapper > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div.text-center.mt-2.mt-lg-0.col-lg-5 > div > div.d-flex.flex-column.align-items-end.justify-content-between.h-100 > div.d-flex.flex-column.w-100 > div.d-flex.align-items-start.justify-content-between.w-100 > div:nth-child(1) > h4",
    booleanCronJob: true,
});
