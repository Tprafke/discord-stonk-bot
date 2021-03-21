const myToken = require('./config.js');
const token = myToken.token;

const Discord = require("discord.js");
const yahooStockPrices = require('yahoo-stock-prices');
const client = new Discord.Client();

// getPrice function makes a request to Yahoo Finance and formats a response
const getPrice = async function (ticker) {
    let response;
    // Checks if request exceeds 5 character limit, returns 'Invalid Entry' if greater than 5
    if (ticker.length <= 5) {
        // Format Ticker for API call
        ticker = ticker.slice(1);
        ticker = ticker.toUpperCase();
        // Runs getCurrentPrice function - Returns stock price from yahoo finance
        let stockPrice = await yahooStockPrices.getCurrentPrice(ticker).catch(e => { console.log(e) });
        // Checks if a valid response has been recieved, returns 'Invalid Entry' if undefined
        if (stockPrice) {
            // Formats Yahoo Finance url string for response
            let yahooFinancePage = `https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`;
            // Formats response with ticker symbol, Last Price, and Yahoo Finance URL
            response = `Ticker: ${ticker}\nLast Price: $${stockPrice}\nMore Info: ${yahooFinancePage}`
            return response; 
        } else if (stockPrice === undefined) {
            response = "Invalid Entry";
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
    // Checks if message is from a bot 
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
    // Checks if message requested stock price and runs getPrice function - sends response to client
    if (msg.content.includes("$") && msg.content.length <= 10) {
        getPrice(msg.content).then(response => msg.channel.send(response));
    }
});

client.login(token)