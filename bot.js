const Discord = require("discord.js");
require('dotenv').config();
const yahooStockPrices = require('yahoo-stock-prices');
const cryptoPrice = require('crypto-price');

const client = new Discord.Client();

// getPrice function makes a stock price request to Yahoo Finance and formats a response
const getPrice = async function (ticker) {
    let response;

    // Format Ticker for API call
    ticker = ticker.toUpperCase();

    // Checks if request exceeds 5 character limit, returns 'Invalid Entry' if greater than 5
    if (ticker.length <= 5) {
        // Runs getCurrentPrice function - Returns stock price from yahoo finance
        let stockPrice = await yahooStockPrices.getCurrentPrice(ticker).catch(e => { console.log(e) });
        // Checks if a valid response has been recieved, returns 'Invalid Entry' if undefined
        if (stockPrice) {
            // Formats Yahoo Finance url string for response
            let yahooFinancePage = `https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`;
            // Formats response with ticker symbol, Last Price, and Yahoo Finance URL
            response = `Ticker: ${ticker}\nLast Price: $${stockPrice}\nMore Info: ${yahooFinancePage}`;
            return response; 
        } else if (stockPrice === undefined) {
            response = "Invalid Entry";
            return response; 
        }
    } else {
        response = "Invalid Entry";
        return response; 
    }
}

// Makes a crypto price request and returns a response
const getCryptoPrice = async function (symbol) {
    let response;

    // Format Symbol for API call
    symbol = symbol.toUpperCase();
    
    if (symbol.length <= 5) {
        let cryptoResponse = await cryptoPrice.getCryptoPrice("USD", symbol).catch(e => {
            console.log(e)
        });
        if (cryptoResponse) {
            // Formats Coinbase URL string for response
            // Doesn't take symbol in query string - needs full crypto name
            let coinbasePage = `https://www.coinbase.com/price/${symbol}`;
            // Formats response with ticker symbol, Last Price
            response = `Symbol: ${symbol}\nLast Price: $${cryptoResponse.price}\nMore Info: ${coinbasePage}`;
            return response; 
        } else if (cryptoResponse === undefined) {
            response = "Invalid Entry";
            return response; 
        }
    } else {
        response = "Invalid Entry";
        return response; 
    }
}

// Declare command prefix
const prefix = '$';

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
// Checks discord client for new messages
client.on("message", msg => {
    // Checks if message is from a bot or starts with command prefix 
    if (!msg.content.startsWith(prefix)|| msg.author.bot) return;
    // Splits message with prefix into seperate arguments
    const args = msg.content.slice(prefix.length).split(/ +/);
    // Formats args into command
    // const cmd = args.shift().toLowerCase();

    // Checks user input for a valid command, takes two arguments
    // args[0] is the first word following the prefix - arg[1] is the second word
    if (args[0]) {
        if (args[0] === 'ping') {
            msg.channel.send('pong!')
        } else if (args[0] === 'stock'){
            if (!args[1]) return msg.channel.send("Error - Please enter second argument.");
            getPrice(args[1]).then(response => msg.channel.send(response));
        } else if (args[0] ==='crypto') {
            if (!args[1]) return msg.channel.send("Error - Please enter second argument.");
            getCryptoPrice(args[1]).then(response => msg.channel.send(response));
        } else if (args[0] === 'stonks') {
            msg.channel.send({
                files: [
                    "./images/stonks.jpeg"
                ]
            });
        } else if  (args[0] === 'help') {
            msg.channel.send('Commands:\n$stock (ticker) - Requests stock price\n$crypto (symbol) - Request crypto price\n$stonks - meme');
        } else if (args[0] === 'info') {
            msg.channel.send('Github: https://github.com/Tprafke/discord-stonk-bot')
        }
        else {
            msg.channel.send('Error - Please enter a valid argument.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN)