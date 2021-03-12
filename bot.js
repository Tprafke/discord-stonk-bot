const myToken = require('./config.js');
const token = myToken.token;

const Discord = require("discord.js");
const yahooStockPrices = require('yahoo-stock-prices');
const client = new Discord.Client();

const getPrice = async function (ticker) {
    // Runs getCurrentPrice function - Returns stock price from yahoo finance
    const stockPrice = await yahooStockPrices.getCurrentPrice(ticker).catch(e => { console.log(e) });
    // Checks if a valid response has been recieved
    if (stockPrice === undefined) {
        let response = "Invalid Entry";
        return response; 
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