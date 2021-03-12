const myToken = require('./config.js');
const token = myToken.token;

const Discord = require("discord.js");
const yahooStockPrices = require('yahoo-stock-prices');
const client = new Discord.Client();

const getPrice = async function (ticker) {
    let stockPrice = await yahooStockPrices.getCurrentPrice(ticker).catch(e => { console.log(e) });
    if (stockPrice) {
        return stockPrice;
    }
    
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    if (msg.author.bot) return
    if (msg.content === "Thank you Stonk Bot") {
        msg.reply("You're welcome");
    }
    if (msg.content.includes("$")) {
        let string = msg.content;
        string = string.slice(1);
        string = string.toUpperCase();
        // getPrice(string).then(price => console.log(price));
        getPrice(string).then(price => msg.channel.send(`$${price}`));
    }
});

client.login(token)