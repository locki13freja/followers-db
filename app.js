const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

const {PORT, booleanCronJob} = require("./config");

const CronJob = require("cron").CronJob;

const schedule = require("./service/schedule");

const artists = require("./json/Artists.json");


const ArtistsController = require("./controllers/artistController");


app.use(cors());
app.use(bodyParser.json());

app.get("/artists", ArtistsController.sendArtists);

app.use((error, req, res, next) => {
    return res.status(500).json({
        message: error,
    });
});


app.listen(PORT, () => {
    console.log(`server listening at ${PORT} port`);
    if (eval(booleanCronJob)) {
        const job = new CronJob("30 * * * *", schedule(artists), null, true, "America/Los_Angeles");
        job.start();
    }
});
