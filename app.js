const express = require("express");
const app = express();

const cors=require('cors')
const bodyParser=require('body-parser')

const { PORT } = require("./config");

const CronJob = require("cron").CronJob;

const schedule = require("./service/schedule");

const artists = require("./json/Artists.json");

const artistsController=require('./controllers/artistController')


app.use(cors())
app.use(bodyParser.json())

app.get('/artists',artistsController.sendArtists)

app.use((error,req,res,next)=>{
    if (error){
        res.status(500).json({
            errorMessage:error
        })
    }
})

app.listen(PORT)

// app.listen(PORT, () => {
//   console.log(`server listening at ${PORT} port`);
//   const job = new CronJob(
//     "30 * * * *",
//     schedule(artists),
//     null,
//     true,
//     "America/Los_Angeles"
//   );
//   job.start();
// });
