const getArtists = require("../service/getArtists");
const {dbName} = require('../config');

class ArtistController {
    static async sendArtists(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await getArtists.getArtists({page, limit});
            if (dbName === 'redis') {
                const {count, resultFromRedis} = result;
                const redisResult = {};
                redisResult.count = count;
                const parsedRedisResult = resultFromRedis.map(item => {
                    return JSON.parse(item);
                });
                redisResult.rows = parsedRedisResult;
                return res.send(redisResult);
            }
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ArtistController;
