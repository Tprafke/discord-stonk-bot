const myToken = require('./config.js');
const token = myToken.token;

const Discord = require("discord.js");
const yahooStockPrices = require('yahoo-stock-prices');
const client = new Discord.Client();

const getPrice = async function (ticker) {
    
    let response;
    // Checks if request exceeds 5 character limit
    if (ticker.length <= 5) {
        // Format Ticker for API call
        ticker = ticker.slice(1);
        ticker = ticker.toUpperCase();
        // Runs getCurrentPrice function - Returns stock price from yahoo finance
        let stockPrice = await yahooStockPrices.getCurrentPrice(ticker).catch(e => { console.log(e) });
        // Checks if a valid response has been recieved
        if (stockPrice === undefined) {
            response = "Invalid Entry";
            return response; 
        } else {
            let stockPage = `https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`;
            response = `Ticker: ${ticker}\nLast Price: $${stockPrice}\nMore Info: ${stockPage}`
            return response;
        }
    }
    else {
        response = "Invalid Entry";
        return response; 
    }
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
// Checks discord client for new messages
client.on("message", msg => {
    if (msg.author.bot) return
    if (msg.content === "Hello Stonk Bot") {
        msg.reply("Hello")
    }
    if (msg.content === "Thank you Stonk Bot") {
        msg.reply("You're welcome");
    }
    if (msg.content === "!stonks" || msg.content === "!STONKS") {
        msg.channel.send({
            files: [
                "./images/stonks.jpeg"
            ]
        });
    }
    if (msg.content === "!HODL" || msg.content === "!hodl") {
        msg.channel.send("Apes Together Strong!");
    }
    if (msg.content === "!GME" || msg.content === "!gme" || msg.content === "!AMC" || msg.content === "!amc" ) {
        msg.channel.send("We like the Stock!");
    }
    // Checks if message requested stock price
    // Formats string for yahoo finance request and returns ticker price
    if (msg.content.includes("$") && msg.content.length <= 10) {
        let string = msg.content;
        getPrice(string).then(response => msg.channel.send(response));
    }
});

client.login(token)