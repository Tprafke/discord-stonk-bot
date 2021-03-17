const myToken = require('./config.js');
const token = myToken.token;

const Discord = require("discord.js");
const yahooStockPrices = require('yahoo-stock-prices');
const client = new Discord.Client();

const getPrice = async function (ticker) {
    // Runs getCurrentPrice function - Returns stock price from yahoo finance
    let stockPrice = await yahooStockPrices.getCurrentPrice(ticker).catch(e => { console.log(e) });
    // Checks if a valid response has been recieved
    if (stockPrice === undefined) {
        stockPrice = "Invalid Entry";
        return stockPrice; 
    } else {
        stockPrice = `$${stockPrice}`;
        return stockPrice;
    }
    
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
// Checks discord client for new messages
client.on("message", msg => {
    if (msg.author.bot) return
    if (msg.content === "Thank you Stonk Bot") {
        msg.reply("You're welcome");
    }
    if (msg.content === "!stonks") {
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
    if (msg.content === "Hello Stonk Bot") {
        msg.reply("Hello")
    }
    // Checks if message requested stock price
    // Formats string for yahoo finance request and returns ticker price
    if (msg.content.includes("$") && msg.content.length <= 5) {
        let string = msg.content;
        string = string.slice(1);
        string = string.toUpperCase();
        getPrice(string).then(response => msg.channel.send(response));
    }
});

client.login(token)