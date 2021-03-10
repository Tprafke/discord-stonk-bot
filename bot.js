const myToken = require('./config.js');
const token = myToken.token;

const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    if (msg.author.bot) return
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

client.login(token)