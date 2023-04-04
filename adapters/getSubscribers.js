const puppeteer = require("puppeteer");
const {
    twitterSelector,
    instagramSelector,
    facebookSelector,
} = require("../config");
const cheerio = require("cheerio");

class GetSubscribers {
    async getSubscribers(artist) {
        const result = {};

        if (artist.twitterId) {
            result.twitter = await this.#getTwiterSubscribers(
                `https://foller.me/${artist.twitterId}`
            );
        }
        if (artist.instId) {
            result.instagram = await this.#getInstagramSubscribers(
                `https://instrack.app/instagram/${artist.instId}`
            );
        }
        if (artist.fbId) {
            result.facebook = await this.#getFacebookSubscribers(
                `https://socialblade.com/facebook/page/${artist.fbId}`
            );
        }
        return {
            username: artist.name,

            instagramSubscribers: result.instagram || 0,
            twitterSubscribers: result.twitter || 0,
            facebookSubscribers: result.facebook || 0,
        };
    }

    async #getTwiterSubscribers(artist) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
            );
            await page.goto(artist, {waitUntil: "load"});
            const content = await page.content();
            await browser.close();
            const $ = await cheerio.load(content);
            let result = await $(twitterSelector).text();
            return Number(result.replace(/,/g, ""));
        } catch (error) {
            return 0;
        }
    }

    async #getInstagramSubscribers(artist) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
            );
            await page.goto(artist, {waitUntil: "load"});
            const content = await page.content();
            await browser.close();
            const $ = await cheerio.load(content);
            let result = await $(instagramSelector).text();
            return Number(result.replace(/,/g, ""));
        } catch (error) {
            return 0;
        }
    }

    async #getFacebookSubscribers(artist) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
            );
            await page.goto(artist, {waitUntil: "load"});
            const content = await page.content();
            await browser.close();
            const $ = await cheerio.load(content);
            let result = await $(facebookSelector).text();
            return Number(result.replace(/\D/g, ''));
        } catch (error) {
            return 0;
        }
    }
}

module.exports = new GetSubscribers();
