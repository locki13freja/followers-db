const express = require("express");
const app = express();
const cors=require('cors')
const { PORT } = require("./config");
const bodyParser=require('body-parser')
const GetArtists=require('../localhost/service/getArtists')

const CronJob = require("cron").CronJob;
const schedule = require("../localhost/service/schedule");

const artists = require("../localhost/json/Artists.json");

app.use(cors())
app.use(bodyParser.json())

app.get('/artists',(req,res)=>{
    try {
   new GetArtists(req,res).getArtists(artists)
    }
    catch (e) {
        res.status(500).json({
            errorMessage:e
        })
    }
})


app.listen(PORT, () => {
  console.log(`server listening at ${PORT} port`);
  const job = new CronJob(
    "30 * * * *",
    schedule(artists),
    null,
    true,
    "America/Los_Angeles"
  );
  job.start();
});
