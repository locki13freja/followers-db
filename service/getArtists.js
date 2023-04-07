const UsersMongodb = require("../models/mongodbModel");
const UsersOrmSequelize = require("../models/postgresModel");
const {dbName} = require("../config");
const {createClient} = require("redis");

class GetArtists {
    async getArtists({page, limit}) {
        try {
            return {
                mongodb: () => this.#getArtistsFromMongoDb(page, limit),
                postgres: () => this.#getArtistsFromPostgres(page, limit),
                redis: () => this.#getArtistsFromRedis(page, limit),
            }[dbName]();
        } catch (error) {
            throw new Error(error);
        }
    }

    async #getArtistsFromMongoDb(page, limit) {
        const endIndex = (page - 1) * limit;
        // const totalCount = await UsersMongodb.countDocuments();
        // const artistsMongodDb = await UsersMongodb.find()
        //     .skip(endIndex)
        //     .limit(limit);

        const [totalCount, artistsMongodDb] = await Promise.all([
            UsersMongodb.countDocuments(),
            UsersMongodb.find().skip(endIndex).limit(limit),
        ]);

        return {
            count: totalCount,
            rows: artistsMongodDb,
        };
    }

    async #getArtistsFromPostgres(page, limit) {
        const offset = limit * (page - 1);
        const resultFromPostgres = UsersOrmSequelize().findAndCountAll({
            limit: limit,
            offset: offset,
        });

        return resultFromPostgres;
    }

    async #getArtistsFromRedis(page, limit) {
        const redis = await createClient();
        await redis.connect();
        const startIndex = (await (page - 1)) * limit;
        const endIndex = (await page) * limit;


        const [totalCount, resultFromRedis] = await Promise.all([
            redis.LLEN("users"),
            redis.LRANGE("users", startIndex, endIndex),
        ]);

        return {
            count: totalCount,
            resultFromRedis: resultFromRedis,
        };
    }
}

module.exports = new GetArtists();
