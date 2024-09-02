
Object.defineProperty(exports, "__esModule", { value: true });
// Import the necessary packages
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const axios = require("axios");
const express = require("express");
const cors = require("cors");
// const http = require('http');
// Create a new Express app
// const app = express();
// Load environment variables
dotenv.config();
const token = process.env.TELEGRAM_TOKEN;
console.log("Bot token:", token); // Confirm token is loaded
// Create a new Telegram bot using polling to fetch new updates
// const bot = new TelegramBot(token, { polling: true });
const bot = new TelegramBot(token, { polling: true, request: {
        agentOptions: {
            keepAlive: true,
            family: 4
        }
    } });
// Assign telegram channel id
const groupUsername = process.env.GROUP_USERNAME;
const channelUsername = process.env.CHANNEL_USERNAME;
const twitter = process.env.TWITTER_ID;
let groupId = 0;
let channelID = 0;
let twitterID = 0;
let USER_ID = 0;
let USER_NAME = "Leo_mint";
let chatId = 0;
const BotMenu = [
    { command: "start", description: "Welcome" },
    { command: "help", description: "Help" },
    { command: "setting", description: "Setting" }
];
// Define the inline keyboard layout for interaction
const options = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "Play click",
                    web_app: {
                        url: "https://mini-app-rocket-game-6qmt.vercel.app/"
                    }
                }
            ]
        ]
    }
};
bot.setMyCommands(BotMenu);
// Handle the /start command
bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id;
    const userID = msg.from.id;
    // USER_ID = chatId;
    console.log("--//---myChatID----//---", chatId);
    const welcomeMessage = "Hello! Welcome to the Rocket Bot!";
    // Send the welcome message with the inline keyboard
    bot.sendMessage(chatId, welcomeMessage, options);
});
bot.onText(/\/help/, (msg) => {
    chatId = msg.chat.id;
    const userID = msg.from.id;
    // USER_ID = chatId;
    console.log("--//---myChatID----//---", chatId);
    const welcomeMessage = "Hello! Welcome to the Erne Legacy Bot!";
    // Send the welcome message with the inline keyboard
    bot.sendMessage(chatId, welcomeMessage);
});
bot.onText(/\/setting/, (msg) => {
    chatId = msg.chat.id;
    const userID = msg.from.id;
    // USER_ID = chatId;
    console.log("--//---myChatID----//---", chatId);
    const welcomeMessage = "Hello! Welcome to the Erne Legacy Bot!";
    // Send the welcome message with the inline keyboard
    bot.sendMessage(chatId, welcomeMessage);
});
 const getProfilePhotos = async (userId, bot_token) => {
    try {
        console.log("bot token : ",bot_token)
        console.log("uerId",userId)
      const profilesResponse = await fetch(`https://api.telegram.org/bot${bot_token}/getUserProfilePhotos?user_id=${userId}`);
      const profiles = await profilesResponse.json();

      if (profiles.result.photos.length > 0) {
        const fileResponse = await fetch(`https://api.telegram.org/bot${bot_token}/getFile?file_id=${profiles.result.photos[0][2].file_id}`);
        const filePath = await fileResponse.json();

        const userAvatarUrl = `https://api.telegram.org/file/bot${bot_token}/${filePath.result.file_path}`;
        return userAvatarUrl;
      } else {
        console.log('No profile photos found.');
      }
    } catch (error) {
      console.error('Error fetching profile photos:', error);
    }
  };
bot.on("message", async (msg) => {
    var _a;
    chatId = msg.chat.id;
    USER_ID = chatId;
    const userID = msg.from.id;
    USER_NAME = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.username;
    console.log("--//---myChatID----//---", chatId);
    console.log("--//---myUserID----//---", userID, msg.from.id, userID, msg.from.username);
    // Check if the message is from the specific group and the specific user
    if (msg.text.includes("/start") && msg.text !== "/start") {
        const startIndex = msg.text.indexOf(" ") + 1; // Find the index of the space and add 1 to get the start of the substring
        const subString = msg.text.substring(startIndex);
        try {
            const friend = subString;
            const userName = msg.from.username;
            const userAvatarUrl = await getProfilePhotos(userID,token)
            console.log(userAvatarUrl);
            let realName = "";
            msg.from.first_name && (realName += msg.from.first_name);
            msg.from.last_name && (realName +=(" " + msg.from.last_name));
            console.log(msg.from);
            console.log(realName);
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            try {
                if (userName !== friend) {
                    await fetch('https://telegramminiapp-rocket-backend-lbyg.onrender.com/add_friend', {
                        method: 'POST',
                        body: JSON.stringify({ userName: userName, realName: realName, friend: friend,userAvatarUrl : userAvatarUrl }),
                        headers
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
            console.log("--//---OK!!!--add friend--//---", subString, msg.from.username);
        }
        catch (error) {
            console.error(error);
        }
    }
});
const app = express();
app.use(cors());
app.use(express.json());
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
