const UsersMongodb = require("../models/mongodbModel");
const UsersOrmSequelize = require("../models/postgresModel");
const mongoose = require("mongoose");
const {createClient} = require("redis");
const {mongodbUriConnection} = require("../config");

class AddToDb {
    #postgres = UsersOrmSequelize();

    constructor() {
        mongoose.set('debug', true);
        mongoose.connect(mongodbUriConnection);
    }

    async addToDb(dbName, userData) {
        return {
            mongodb: () => this.#addToMongodb(userData),
            postgres: () => this.#addToPostgres(userData),
            redis: () => this.#addToRedis(userData),
        }[dbName]();
    }

    async #addToMongodb(data) {
        const {
            username, instagramSubscribers, twitterSubscribers, facebookSubscribers,
        } = await data;

        let cashedUsername = await UsersMongodb.findOneAndUpdate({username: username}, {
            instagramSubscribers: instagramSubscribers,
            twitterSubscribers: twitterSubscribers,
            facebookSubscribers: facebookSubscribers,
        });

        if (!Boolean(cashedUsername)) {
            const usersMongodb = new UsersMongodb({
                username: username,
                instagramSubscribers: instagramSubscribers,
                twitterSubscribers: twitterSubscribers,
                facebookSubscribers: facebookSubscribers,
            });
            await usersMongodb.save();
        }
    }

    async #addToPostgres(data) {
        const {
            username, instagramSubscribers, twitterSubscribers, facebookSubscribers,
        } = data;

        await this.#postgres.findOne({where: {username: username}}).then((result) => {
            if (result) {
                return result.update({
                    username, instagramSubscribers, twitterSubscribers, facebookSubscribers,
                }, {where: {username: username}});
            }
            return this.#postgres.create({
                username, instagramSubscribers, twitterSubscribers, facebookSubscribers,
            });
        });
    }

    async #addToRedis(data) {
        await data;
        const redis = await createClient();
        await redis.connect();
        const redisResult = await redis.GET();
        // await redis.RPUSH('users', JSON.stringify(data));
        console.log(redisResult);
    }
}

module.exports = new AddToDb();
