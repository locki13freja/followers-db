const UsersMongodb = require("../models/mongodbModel");
const UsersOrmSequelize = require("../models/postgresModel");
const {mongodbUriConnection, dbName, limit} = require("../config");
const mongoose = require('mongoose')
const {createClient} = require("redis");

class GetArtists {
    #req;
    #res;
    #redis = createClient()

    constructor(req, res) {
        mongoose.connect(mongodbUriConnection);
        this.#req = req
        this.#res = res
    }

    getArtists(json) {
            if (typeof json === 'object' && json.length > 1) {
                return this.#res.send(this.#getArtistsFromJson(json))
            }
            switch (dbName) {
                case "mongodb":
                    return this.#res.send(this.#getArtistsFromMongoDb());
                    break;
                case "postgres":
                    return this.#res.send(this.#getArtistsFromPostgres());
                    break;
                case "redis":
                    return this.#res.send(this.#getArtistsFromRedis())
                    break;
                default:
                    throw new Error('error')
            }
    }

    #getPagination() {
        const page = parseInt(this.#req.query.page) || 1

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        return {
            startIndex,
            endIndex
        }
    }

    #getArtistsFromJson(json) {
        const resultDataFromJson = json.slice(this.#getPagination().startIndex, this.#getPagination().endIndex)
        return JSON.stringify(resultDataFromJson)
    }

    #getArtistsFromMongoDb() {
        const resultFromMongoDb = UsersMongodb.find().slice(this.#getPagination().startIndex, this.#getPagination().endIndex)

        return JSON.stringify(resultFromMongoDb);
    }

    #getArtistsFromPostgres() {
        const resultFromPostgres = UsersOrmSequelize().findAll().slice(this.#getPagination().startIndex, this.#getPagination().endIndex)

        return JSON.stringify(resultFromPostgres)
    }

    #getArtistsFromRedis() {
        const resultFromRedis = this.#redis.ZRANGE(this.#getPagination().startIndex, this.#getPagination().endIndex)
        return JSON.stringify(resultFromRedis)
    }
}

module.exports = GetArtists