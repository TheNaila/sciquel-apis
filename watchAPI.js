//Naila Thevenot

const express = require("express");
const nodemon = require("nodemon");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const {MongoClient} = require("mongodb");
const uri = process.env.MONGO_URI;


router.get("/",  (req,res) =>{

    try{
        MongoClient.connect(uri,  { useUnifiedTopology: true, useNewURLParser: true }, (err, client) => {
            if(err){
                console.log(err);
                res.sendStatus(500);
            }
          
            client.db("SciquelDB").command({ ping: 1 }); 
            console.log("Connected successfully to server");
    
            const db = client.db("SciquelDB");
            var stories = db.collection("stories"); 
            stories.find({StoryType : "Podcast"}).toArray((err,data)=>{
                if(err){
                    console.log(error);
                }
                else{
                    var arr = []; 
                    data.forEach((doc) => {
                        const message = {
                            "Author Name" : doc.AuthorName,
                            "PublishedDate" : doc.PublishedDate,
                            "StoryCoverImg" : doc.StoryCoverImg,
                            "StoryTitle" : doc.StoryTitle,
                            "StoryLink" : doc.StoryLink,
    
                        }
                        
                        arr.push(message); 
                    
                    })
                    if(arr.length <= 0) {
                        res.sendStatus(404);
                    }else{
                        var dict = {"Stories" : arr};
                        res.send(dict);
                    }
                    client.close(); 
                    
                    
                }
            });
        })

    }catch(err){
        return res.send(err);
    };
    
            
    
});

module.exports = router;