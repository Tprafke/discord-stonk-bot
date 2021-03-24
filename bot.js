const myToken = require('./config.js');
const token = myToken.token;

const Discord = require("discord.js");
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
            response = `Ticker: ${ticker}\nLast Price: $${stockPrice}\nMore Info: ${yahooFinancePage}`
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
            // Formats response with ticker symbol, Last Price
            response = `Symbol: ${symbol}\nLast Price: $${cryptoResponse.price}`
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


const prefix = '$';

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
// Checks discord client for new messages
client.on("message", msg => {
    // Checks if message is from a bot 
    if (!msg.content.startsWith(prefix)|| msg.author.bot) return;
    // Splits user commands including the prefix into arguments
    const args = msg.content.slice(prefix.length).split(/ +/);
    // Switch statement to check for user commands, takes two arguments
    // args[0] is the first word following the prefix - arg[1] is the second word
    switch(args[0]) {
        case 'ping':
            msg.channel.send('pong!')
            break;
        case 'stock':
            if (!args[1]) return msg.channel.send("Error - Please enter second argument.");
            getPrice(args[1]).then(response => msg.channel.send(response));
            break;
        case 'crypto':
            if (!args[1]) return msg.channel.send("Error - Please enter second argument.");
            getCryptoPrice(args[1]).then(response => msg.channel.send(response));
            break;
        case 'stonk':
            msg.channel.send({
                files: [
                    "./images/stonks.jpeg"
                ]
            });
            break;
        case 'help':
            msg.channel.send('Commands:\n$stock (ticker) - Requests stock price\n$crypto (symbol) - Request crypto price');
            break;
    }
});

client.login(token)