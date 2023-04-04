const UsersMongodb = require("../models/mongodbModel");
const UsersOrmSequelize = require("../models/postgresModel");
const {mongodbUriConnection, dbName} = require("../config");
const mongoose = require("mongoose");
const {createClient} = require("redis");

class GetArtists {
    #req;
    #redis = createClient();
    constructor(req) {
        this.#req = req;
    }

    async getArtists(json) {
        if (typeof json === "object" && json.length > 1) {
            return await this.#getArtistsFromJson(json);
        }
        switch (dbName) {
            case "mongodb":
                 await this.#getArtistsFromMongoDb();
                break;
            case "postgres":
                 await this.#getArtistsFromPostgres();
                break;
            case "redis":
                 await this.#getArtistsFromRedis();
                break;
            default:
                throw new Error("error");
        }
    }

    #getPagination() {

        const {page, limit} = this.#req.query
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const offset=(page*limit)-limit
        return {
           startIndex,
            endIndex,
            limit,offset
        };
    }

    #getArtistsFromJson(json) {
        const resultDataFromJson = json.slice(
            this.#getPagination().startIndex,
            this.#getPagination().endIndex
        );
        return JSON.stringify(resultDataFromJson);
    }

    #getArtistsFromMongoDb() {
        mongoose.connect(mongodbUriConnection);
        const resultFromMongoDb = UsersMongodb.find().skip(+this.#getPagination().startIndex).limit(+this.#getPagination().limit)

        return JSON.stringify(resultFromMongoDb);
    }

    #getArtistsFromPostgres() {
        const resultFromPostgres = UsersOrmSequelize().findAndCountAll({
            limit:this.#getPagination().limit,
            offset:this.#getPagination().offset
        })


        return JSON.stringify(resultFromPostgres);
    }

    #getArtistsFromRedis() {
        const resultFromRedis = this.#redis.ZRANGE(
            this.#getPagination().startIndex,
            this.#getPagination().endIndex
        );
        return JSON.stringify(resultFromRedis);
    }
}

module.exports=GetArtists
