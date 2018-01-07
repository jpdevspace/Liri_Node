require('dotenv').config();
const Twitter = require('twitter');
const request = require('request');
const Spotify = require('node-spotify-api');
const myKeys = require('./keys');

// Creating new connections to Twitter and Spotify
const client = new Twitter(myKeys.twitter); 
const spotify = new Spotify(myKeys.spotify);


// Twitter API - Displays your last 20 tweets and when they were created at in your terminal/bash window.
const myTweets = () => { 
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

// Spotify API - Function that displays: Artist, Album and the preview url from a song that the user chooses
const mySpotify = (userInput) => {
    let userInputArr = [];  // Holds all arguments passed by the user in the command line
    let userInputStr = '';  // Holds all arguments as one string

    // Converts the array of arguments into one string to be used as a query search string
    for ( let i = 3; i < userInput.length; i++) {
        userInputArr.push(userInput[i]);
        userInputStr = userInputArr.join(' ');
    }

    // Spotify API to search for song
    spotify.search({ type: 'track', query: userInputStr }, (err, data) => {
        
        if (err) { return console.log('Error occurred: ' + err); }; // If there's an error show it

        let totalResults = data.tracks.total;   // Get the number of results from the response object
        console.log(`Results Found: ${totalResults}`);  // Let the user know how many results where found

        for(let j = 0; j < totalResults; j++) { // Looping through the response JSON to display specific info
            console.log(`
                Result #${j+1}:
                Song: ${data.tracks.items[j].name}
                Artist: ${data.tracks.items[j].album.artists[0].name}
                Album: ${data.tracks.items[j].album.name}
                Preview: ${data.tracks.items[j].preview_url}
            `);
            
        };
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