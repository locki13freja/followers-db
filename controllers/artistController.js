const GetArtists=require('../service/getArtists')
class ArtistController {
    sendArtists(req,res,next){
       try{
           res.send(new GetArtists(req).getArtists)
       }
       catch (error) {
           next(error)
       }
    }
}

module.exports=new ArtistController()