require('dotenv').config();
const fs = require('fs');
const { spawn } = require('child_process');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const myKeys = require('./keys');

// Creating new connections to Twitter and Spotify
const client = new Twitter(myKeys.twitter); 
const spotify = new Spotify(myKeys.spotify);


// Twitter API - Displays your last 20 tweets and when they were created at in your terminal/bash window.
const myTweets = () => { 
    const params = {    // Setting up the query paramaters
        screen_name: 'JeanPaulG_', // Query Search
    };

    // Call to Twitter API using our Twitter connection
    client.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params, (error, data, response) => {
        if (error) throw error;

        const totalTweets = data.length;
        console.log(`Here is a list of all ${totalTweets} of Jean Paul's Tweets:\n`);

        // Append the results into a file called 'log.txt', if no file, it creates it
        fs.appendFile('log.txt', '\n##### Results from Twitter API #####\n', err => { if (err) throw err; });

        for (let i = 0; i < totalTweets; i++) {
            let result = `
                Tweet #${i+1}:
                Created on: ${data[i].created_at}
                Content: ${data[i].text}\n
            `;
            
            console.log(result);    // Display result in terminal
            fs.appendFile('log.txt', `${result}`, err => { if (err) throw err; });   // Append results in log.txt
        }
    });
}


// Spotify API - Function that displays: Artist, Album and the preview url from a song that the user chooses
const mySpotify = userInput => {
    let userInputArr = [];  // Holds all arguments passed by the user in the command line
    let userInputStr = '';  // Holds all arguments as one string
    let resultsSubset = 0;

    if( userInput.length == 3 ) {
        userInputStr = "The Sign by Ace of Base";
    } 
    else {
        // Converts the array of arguments into one string to be used as a query search string
        for ( let i = 3; i < userInput.length; i++) {
            userInputArr.push(userInput[i]);
            userInputStr = userInputArr.join(' ');
        }
    }
    // Call to Spotify API to search for song using our Spotify connection
    spotify.search({ type: 'track', query: userInputStr }, (err, data) => {
        
        if (err) { return console.log('Error occurred: ' + err); }; // If there's an error show it

        let totalResults = data.tracks.total;   // Get the number of results from the response object
        console.log(`Results Found: ${totalResults}`);  // Let the user know how many results where found

        if (totalResults > 5) {    // If there are more than 5 results 
            resultsSubset = 5;      // Show only the first 5
        }
        else {  // If there are less than 5 results
            resultsSubset = totalResults;   // Display all available data
        }

        // Append results in log.txt
        fs.appendFile('log.txt', '\n##### Results from Spotify API ####\n', err => { if (err) throw err; });
        for(let j = 0; j < resultsSubset; j++) { // Looping through the response JSON to display specific info
            let result = `
                Result #${j+1}:
                Song: ${data.tracks.items[j].name}
                Artist: ${data.tracks.items[j].album.artists[0].name}
                Album: ${data.tracks.items[j].album.name}
                Preview: ${data.tracks.items[j].preview_url}
            `;
            
            console.log(result);    // Display result in terminal
            fs.appendFile('log.txt', `${result}`, err => { if (err) throw err; });   // Append results in log.txt
        };
    });
};


const myMovie = title => {
    let userInputArr = [];  // Holds all arguments passed by the user in the command line
    let userInputStr = '';  // Holds all arguments as one string

    if( title.length == 3 ) {
        userInputStr = "Mr. Nobody";
    } 
    else {
        // Converts the array of arguments into one string to be used as a query search string
        for ( let i = 3; i < title.length; i++) {
            userInputArr.push(title[i]);
            userInputStr = userInputArr.join(' ');
        }
    }

    // OMDB API endpoint
    let queryUrl = "http://www.omdbapi.com/?t=" + userInputStr + "&y=&plot=short&apikey=trilogy";

    // Then create a request to the queryUrl
    request(queryUrl, function (error, response, body) {
        if (error) throw error; // If there's an error show it
        if (!error && response.statusCode === 200) {
            let jsonBody = JSON.parse(body);  // The response is a huge string... parse it as a JSON
            
            // Append results in log.txt
            fs.appendFile('log.txt', '\n##### Results from OMDB API ####\n', err => { if (err) throw err; });

            let result = `  
                Movie: ${jsonBody.Title}
                Released date: ${jsonBody.Released}
                IMDB Rating: ${jsonBody.Ratings[0].Value}
                Rotten Tomatoes Rating: ${jsonBody.Ratings[1].Value}
                Country: ${jsonBody.Country}
                Language: ${jsonBody.Language}
                Actors: ${jsonBody.Actors}
                About: ${jsonBody.Plot}
            `;

            console.log(result);    // Display result in terminal
            fs.appendFile('log.txt', `${result}`, err => { if (err) throw err; });   // Append results in log.txt

        }   
    });
}


// Function that reads a file from the system and executes Node using the arguments in the text file
const doIt = () => {    
    let userCommand = '';
    let defaultArgument = '';
    
    fs.readFile('./random.txt', 'utf8', (err, data) => {    // Read the file 'random.txt'
        if (err) throw err;    // If there's an error show it
        
        let dataToArr = data.split(',');    // Turn the data in the file into an array
        
        userCommand = dataToArr[0];
        defaultArgument = dataToArr[1];

        // Spawning a child process spawn(command [,arguments])
        const child = spawn('node', ['app.js', userCommand, defaultArgument]);

        child.stdout.on('data', (data) => { // When data is received, print it
            console.log(`${data}`);
        });
          
        child.stderr.on('data', (data) => { // If there is an error, print it
            console.error(`Error:\n${data}`);
        });
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
        myMovie(process.argv);
        break;
    case 'do-what-it-says':
        doIt();
        break;
    default:
        console.log('Please try again using a valid command');
};