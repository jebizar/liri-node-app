require("dotenv").config();

var fs = require("fs");

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var request = require('request')
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var query = process.argv[3];

switch(command){
    case "concert-this":
    concertThis(query);
    break;

    case "spotify-this-song":
    spotifyThisSong(query);
    break;

    case "movie-this":
    movieThis(query);
    break;

    case "do-what-it-says":
    doWhatItSays(query);
    break;
}

function movieThis(argument) {

    var queryURL = "http://www.omdbapi.com/?t=" + argument + "&plot=short&apikey=trilogy";

    request(queryURL, function(error,response,body){
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        for(var i = 0; i < JSON.parse(body).Ratings.length; i++){
            if(JSON.parse(body).Ratings[i].Source == "Rotten Tomatoes"){
                console.log("Rotten Tomatoes Rating: " + (JSON.parse(body).Ratings[i].Value));
            }
        }
        console.log("Production Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
    })

}

function concertThis(argument) {

    var queryURL = "https://rest.bandsintown.com/artists/" + argument + "/events?app_id=codingbootcamp";

    request(queryURL, function(error,response,body){
        for(var i =0; i < JSON.parse(body).length; i++) {
            console.log("Venue Name: " + JSON.parse(body)[i].venue.name);
            console.log("Venue Location: " + JSON.parse(body)[i].venue.city);
            console.log("Time: " + moment(JSON.parse(body)[i].datetime).format('MM/DD/YYYY') + "\n");
        }
    })
}
function spotifyThisSong(argument){

    spotify
    .search({ 
        type: 'track',
        query: argument
     })
    .then(function(response) {
        var arr = [];
        // var arr2 = [];
        response.tracks.items.forEach(function(item) {
            var currName = item.artists[0].name;
            var songName = item.name;
            var linkName = item.href;
            var albumName = item.album.name;

            if (arr.indexOf(currName) == -1) {
                arr.push(currName);
                console.log("Artist: " + currName);
                console.log("Song Name: " + songName);
                console.log("Link: " + linkName);
                console.log("Album: " + albumName + "\n");

                // printObj = {
                //     artists: currName,
                //     songName: songName,
                //     songLink: linkName,
                //     album: albumName
                // }
                // arr2.push(printObj);
            }
        });
        
    })
    .catch(function(err) {
      console.log(err);
    });
}

function doWhatItSays(argument){
    fs.readFile('random.txt', 'utf8', function(error, data){
        if (error) {
            return console.log(error);
        }
        data = data.split(",")
        spotifyThisSong(data[1]);
    })
}