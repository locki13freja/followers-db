const UsersMongodb = require("../models/mongodbModel");
const UsersOrmSequelize = require("../models/postgresModel");
const mongoose = require("mongoose");
const { createClient } = require("redis");
const { mongodbUriConnection } = require("../config");

class AddToDb {
  #redis = createClient();
  #postgres = UsersOrmSequelize();
  constructor() {
    mongoose.connect(mongodbUriConnection);
  }

  async addToDb(dbName, userData) {
    try {
      switch (dbName) {
        case "mongodb":
          await this.#addToMongodb(userData);
          break;
        case "postgres":
          await this.#addToPostgres(userData);
          break;
        case "redis":
          await this.#addToRedis(userData);
          break;
        case "mongodb + redis":
          await this.#addToMongodb(userData);
          await this.#addToRedis(userData);
          break;
        case "mongdb + postgres":
          await this.#addToMongodb(userData);
          await this.#addToPostgres(userData);
          break;
        case "postgres + redis":
          await this.#addToPostgres(userData);
          await this.#addToRedis(userData);
          break;
        case "postgres + mongodb + redis":
          await this.#addToMongodb(userData);
          await this.#addToPostgres(userData);
          await this.#addToRedis(userData);
          break;
        default:
          throw new Error("dbName incorrect");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async #addToMongodb(data) {
    try {
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
      await usersMongodb.save()
    } catch (error) {
      throw new Error(error);
    }
  }

  async #addToPostgres(data) {
    try {
      const {
        username,
        instagramSubscribers,
        twitterSubscribers,
        facebookSubscribers,
      } = data;
      const usersPostgres = await this.#postgres
        .create({
          username,
          instagramSubscribers,
          twitterSubscribers,
          facebookSubscribers,
        })
    } catch (error) {
      throw new Error(error);
    }
  }

  async #addToRedis(data) {
    try {
      const {
        username,
        instagramSubscribers,
        twitterSubscribers,
        facebookSubscribers,
      } = data;

      await this.#redis
        .connect()
      await this.#redis
        .LPUSH(
          username,
          instagramSubscribers,
          twitterSubscribers,
          facebookSubscribers
        )
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new AddToDb();
