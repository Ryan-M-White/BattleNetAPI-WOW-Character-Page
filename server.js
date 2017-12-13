//use express for our server
var express = require('express');
var app = express();
var fs = require('fs');
//use bodyParser for reading req.body
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//blizzard.js makes all of our queries to Battle.net for us
const blizzard = require('blizzard.js').initialize({apikey: "6mm6ryqnawqzhqxceugnsbznu5b5u2m3"});
app.use(express.static(__dirname + '/Source'));

//Listen on port 3000
app.listen(3000, function() {
    console.log("Launch successful. To access app, open your browser and insert the following URL into your address bar: http://localhost:3000/");
});

//Deliver the page
app.get('/', function (req, res) {
    console.log("Loading Home Page...");
    res.sendFile('/Source/mainpage.html', {root: __dirname });
});

//Gives access token to the user
app.get('/getToken', function (req, res) {
    blizzard.data.credentials({id: "6mm6ryqnawqzhqxceugnsbznu5b5u2m3", secret: "hEVsKs2V9WHuAx9kvC2vcaZyxyTYPMNg", origin: 'us' })
    .then(response => {
      res.send(response.data.access_token);
    });
})

//Pre-loads our selectbox with all available realms to search in the US
app.post('/loadRealms', jsonParser, function (req, res) {
    blizzard.data.realm({ access_token: req.body.token, namespace: 'dynamic-us', origin: 'us' })
    .then(response => {
        res.send(response.data.realms);
    });
})


//Retrieves all info for the requested character
app.post('/searchCharacter', jsonParser, function (req, res) {
    blizzard.wow.character(['profile', 'stats', 'items', 'statistics'], { origin: 'us', realm: req.body.realm.name, name: req.body.name })
    .then(response => {
        if(response.status != 200){
            res.send("That character doesn't exist! Please enter a valid character name.");
        } else {
            res.send(response.data);
        }
    });
});

//Retrieves additional info about the character's items.
app.post('/getItemInfo/:id', jsonParser, function (req, res) {
    blizzard.wow.item({ id: req.params.id, origin: 'us' })
    .then(response => {
        if(response.status != 200){
            res.send("That character doesn't exist! Please enter a valid character name.");
        } else {
            res.send(response.data);
        }
    });
});