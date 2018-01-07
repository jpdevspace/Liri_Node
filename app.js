require('dotenv').config();
const Twitter = require('twitter');
const request = require('request');
const Spotify = require('node-spotify-api');
const myKeys = require('./keys');

// Creating new connections to Twitter and Spotify
const client = new Twitter(myKeys.twitter); 
const spotify = new Spotify(myKeys.spotify);



const myTweets = () => { //This will show your last 20 tweets and when they were created at in your terminal/bash window.
    const params = {    // Setting up the query paramaters
        screen_name: 'JeanPaulG_', // Query Search
    };

    client.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params, (error, data, response) => {
        if (error) throw error;

        const totalTweets = data.length;
        console.log(`Here is a list of all ${totalTweets} of Jean Paul's Tweets:\n`);

        for (let i = 0; i < totalTweets; i++) {
            console.log(`
                Tweet #${i+1}:\n
                Created on: ${data[i].created_at}\n
                Content: ${data[i].text}\n
            `);
        }
    });
}

const mySpotify = (userInput) => {
    let userInputArr = [];  // Holds the user input (name of song) from the command line
    let userInputStr = '';
    for ( let i = 3; i < userInput.length; i++) {
        userInputArr.push(userInput[i]);
        userInputStr = userInputArr.join(' ');
    }
    console.log(userInputStr);
    spotify.search({ type: 'track', query: userInputStr }, (err, data) => {
        if (err) { return console.log('Error occurred: ' + err); };
        //console.log(data.tracks.items[0].album.name);
        for(let j = 0; j < data.tracks.total; j++) {
            console.log(data.tracks.items[j].album.name);
        };
        //console.log(JSON.stringify(data, null, 2)); 
    });

}

// Get user arguments from the command line and call the appropiate function 
switch(process.argv[2]) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        mySpotify(process.argv);
        break;
    case 'movie-this':
        withdraw(process.argv[3]);
        break;
    case 'do-what-it-says':
        lotto();
        break;
    default:
        console.log('yeah');
};