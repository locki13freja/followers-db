const { dbName } = require("../config");
const AddToDb = require("../adapters/addToDb");
const GetSubscribers = require("../adapters/getSubscribers");

module.exports = async (artists) => {
  try {
    for await (const artist of artists) {
      const subs = await GetSubscribers.getSubscribers(artist);
      await AddToDb.addToDb(dbName, subs);
    }
  } catch (error) {
    throw new Error(error);
  }
};
