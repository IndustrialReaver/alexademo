'use strict';

// Require Alexa SKill SDK
const Alexa = require('alexa-sdk');

// Data
const data = [
    {"name": "ben", "info": "is a cloud engineer."},
    {"name": "krishnan", "info": "works for rain."},
    {"name": "rupa", "info": "works for rain."},
    {"name": "giri", "info": "works for rain."},
    {"name": "sri", "info": "works for rain."}
];

// Welcome message
const welcome_message = "Hello, who would you like me to introduce?";

// Help Message
const help_message = "You can say: 'Alexa, ask rain cloud who is name'";

// Exit Message
const exit_message = "OK.";

// Unhamdled message
const unhandled_message = "I'm sorry, I did not understand that.";


const handlers = {
    "lookupIntent": function() {
        var searchQuery = this.event.request.intent.slots.first_name.value
        var searchResults = searchDatabase(data, searchQuery);

        if (searchResults.count > 1) { //multiple results found again
            var response = "I found " + searchResults.count + " resutls. ";
            for (var i = 0; i < searchResults.count; i++) {
                response += searchResults.results[i].name + " " + searchResults.results[i].info + ". ";
            }
            this.emit(":tell", response);
        } else if (searchResults.count == 1) { //one result found
            console.log(searchResults);
            var result = searchResults.results[0];
            console.log(result);
            this.emit(":tell", result.name + " " + result.info);
        } else { //no match found
            this.emit(":tell", "Sorry, I do not know " + searchQuery);
        }
    },
    "LaunchRequest": function() {
        this.emit(':ask', welcome_message, help_message);
    },
    "AMAZON.StopIntent": function () {
        this.emit(':tell', exit_message);
    },
    "AMAZON.CancelIntent": function () { 
        this.emit(':tell', exit_message);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(':ask', help_message, help_message);
    },
    "Unhandled": function() {
        this.emit(':ask', unhandled_message, help_message);
    }
};

// Export Handlers
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.appId = "";
    alexa.registerHandlers( handlers );
    alexa.execute();
};

// vvv Helper Methods vvv

function searchDatabase(dataset, searchQuery) {
    var matchFound = false;
    var results = [];

    //beginning search
    for (var i = 0; i < dataset.length; i++) {
        if (sanitizeSearchQuery(searchQuery) == dataset[i]["name"]) {
            results.push(dataset[i]);
            matchFound = true;
        }
        if ((i == dataset.length - 1) && (matchFound == false)) {
        //this means that we are on the last record, and no match was found
            matchFound = false;
            console.log("no match was found using name");
        //if more than searchable items were provided, set searchType to the next item, and set i=0
        //ideally you want to start search with lastName, then firstname, and then cityName
        }
    }
    return {
        count: results.length,
        results: results
    };
}

function sanitizeSearchQuery(searchQuery){
    searchQuery = searchQuery.replace(/’s/g, "").toLowerCase();
    searchQuery = searchQuery.replace(/'s/g, "").toLowerCase();
    return searchQuery;
}