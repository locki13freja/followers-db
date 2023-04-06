const UsersMongodb = require("../models/mongodbModel");
const UsersOrmSequelize = require("../models/postgresModel");
const mongoose = require("mongoose");
const {createClient} = require("redis");
const {mongodbUriConnection} = require("../config");

class AddToDb {
    #postgres = UsersOrmSequelize();

    constructor() {
        mongoose.connect(mongodbUriConnection);
    }

    async addToDb(dbName, userData) {
        try {
            return {
                "mongodb": () => this.#addToMongodb(userData),
                "postgres": () => this.#addToPostgres(userData),
                "redis": () => this.#addToRedis(userData)
            }[dbName]();
        } catch (error) {
            throw new Error(error);
        }
    }

    async #addToMongodb(data) {
        const {
            username,
            instagramSubscribers,
            twitterSubscribers,
            facebookSubscribers,
        } = await data;

        const usersMongodb = await new UsersMongodb({
            username: username,
            instagramSubscribers: instagramSubscribers,
            twitterSubscribers: twitterSubscribers,
            facebookSubscribers: facebookSubscribers,
        });
        await usersMongodb.save();
    }

    async #addToPostgres(data) {
        const {
            username,
            instagramSubscribers,
            twitterSubscribers,
            facebookSubscribers,
        } = data;
        await this.#postgres
            .create({
                username,
                instagramSubscribers,
                twitterSubscribers,
                facebookSubscribers,
            });
    }

    async #addToRedis(data) {
        await data;
        const redis = await createClient();
        await redis.connect();
        await redis.LPUSH(`users`, JSON.stringify(data));
    }
}

module.exports = new AddToDb();
