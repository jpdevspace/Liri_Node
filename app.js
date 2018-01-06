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

// Get user arguments from the command line and call the appropiate function 
switch(process.argv[2]) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        deposit(process.argv[3]);
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