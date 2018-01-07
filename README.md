# Liri_Node

Command line Node app that takes in parameters to display info from Twitter, Spotify and OMDB.

![alt text][screenshot]

[screenshot]: https://github.com/jpdevspace/Liri_Node/blob/master/img/screenshot.gif "Node app GIF"


## Getting started

1. Clone this repo in your project folder 

2. Run:

```
npm install
```

3. Create a .env file in the root folder of your project and provide your own keys for the Twitter and Spotify APIs. Your .env file should look like 

```
# Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```

## Built With
[Node] (https://nodejs.org/en/)
[Twitter] (https://www.npmjs.com/package/twitter) NPM Package
[Spotify] (https://www.npmjs.com/package/node-spotify-api) NPM Package
[Request] (https://www.npmjs.com/package/request) NPM Package
[DotENV] (https://www.npmjs.com/package/dotenv) NPM Package
