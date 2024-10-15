
Object.defineProperty(exports, "__esModule", { value: true });
// Import the necessary packages
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const { userStates, resetUserState } = require('./state')
const { addPost } = require('./post')

// Load environment variables
dotenv.config();
const token = process.env.TELEGRAM_TOKEN;
let textPost = ''
let buttonName = ''
let buttonUrl = ''
let userlist = [];
const adminlist = [6802660922, 136031568];

const headers = new Headers();
headers.append('Content-Type', 'application/json')

const fetchData = async () => {
    await fetch(`${process.env.SERVER_URL}/all_users_id`, { method: 'POST', headers })
        .then(res => Promise.all([res.status, res.json()]))
        .then(([status, data]) => {
            userlist = data;

        })
}
fetchData();
console.log("await");

// Create a new Telegram bot using polling to fetch new updates
const bot = new TelegramBot(token, {
    polling: true, request: {
        agentOptions: {
            keepAlive: true,
            family: 4
        }
    }
});
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
                    text: "🚀 PLAY CLICK 🚀",
                    web_app: {
                        url: "https://miniapprocketgame.onrender.com"
                    }
                }
            ]
        ]
    }
};
bot.setMyCommands(BotMenu);
// Handle the /start command
bot.onText(/\/start/, (msg) => {
    resetUserState()
    chatId = msg.chat.id;
    const userID = msg.from.id;
    // USER_ID = chatId;
    console.log("--//---myChatID----//---", chatId);
    const welcomeMessage = "Start your journey now!🚀 Play and earn rewards in the RocketTON game!💰";
    // Send the welcome message with the inline keyboard
    bot.sendMessage(chatId, welcomeMessage, options);
});
bot.onText(/\/help/, (msg) => {
    resetUserState()
    chatId = msg.chat.id;
    const userID = msg.from.id;
    // USER_ID = chatId;
    console.log("--//---myChatID----//---", chatId);
    const welcomeMessage = "Hello! Welcome to the Rocket TON Game!";
    // Send the welcome message with the inline keyboard
    bot.sendMessage(chatId, welcomeMessage);
});
bot.onText(/\/setting/, (msg) => {
    resetUserState()
    chatId = msg.chat.id;
    const userID = msg.from.id;
    // USER_ID = chatId;
    console.log("--//---myChatID----//---", chatId);
    const welcomeMessage = "Hello! Welcome to the Rocket TON Game!";
    // Send the welcome message with the inline keyboard
    bot.sendMessage(chatId, welcomeMessage);
});
bot.onText(/\/announce/, (msg) => {
    resetUserState()
    console.log("announce")
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    if (!adminlist.includes(parseInt(userId))) return;
    const text = msg.text ? msg.text.trim() : '';

    userStates.set(userId, { step: 'waiting_text' });
    bot.sendMessage(
        chatId,
        'Post:'
    );

})
bot.on('polling_error', (error) => {
    console.log(`[polling_error] ${error.code}: ${error.message}`);
});
const getProfilePhotos = async (userId, bot_token) => {
    try {
        
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
    let _a;
    chatId = msg.chat.id;
    USER_ID = chatId;
    const userID = msg.from.id;
    const userId = userID.toString();
    const text = msg.text ? msg.text.trim() : '';


    // Define bot commands
    const BotMenu = [
        { command: "start", description: "Welcome" },
        { command: "help", description: "Help" },
        { command: "setting", description: "Setting" },
    ];
    if (adminlist.includes(parseInt(userId)))
        BotMenu.push({ command: "announce", description: "Announce" })
    // Set bot commands
    bot.setMyCommands(BotMenu);

    USER_NAME = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.username;
    console.log("--//---myChatID----//---", chatId);
    console.log("--//---myUserID----//---", userID, msg.from.id, userID, msg.from.username);
    // Check if the message is from the specific group and the specific user
    if (msg.text && msg.text.includes("/start") && msg.text !== "/start") {
        const startIndex = msg.text.indexOf(" ") + 1; // Find the index of the space and add 1 to get the start of the substring
        const subString = msg.text.substring(startIndex);
        try {
            const friend = parseInt(subString);
            const userName = msg.from.username;
            const userAvatarUrl = await getProfilePhotos(userID, token)
            console.log(userAvatarUrl);
            let realName = "";
            console.log(friend)
            console.log(userID)
            msg.from.first_name && (realName += msg.from.first_name);
            msg.from.last_name && (realName += (" " + msg.from.last_name));
            console.log(msg.from);
            console.log(realName);
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            try {
                if (userID !== friend) {
                    await fetch('https://telegramminiapp-rocket-backend-lbyg.onrender.com/add_friend', {
                        method: 'POST',
                        body: JSON.stringify({ userId: userID, userName: userName, realName: realName, friend: friend, userAvatarUrl: userAvatarUrl }),
                        headers
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
            console.log("--//---OK!!!--add friend--//---", subString, userID);
        }
        catch (error) {
            console.error(error);
        }
    }

    if (text.startsWith('/')) {
        resetUserState()
        return;
    }
    const state = userStates.get(userId); // Fetch the user's state
    console.log(state)
    if (state) {
        switch (state.step) {

            case 'waiting_text':
                textPost = text;
                console.log("text of post", textPost);

                bot.sendMessage(chatId,
                    `Button’s title:`
                )
                userStates.set(userId, { step: "wating_button_name" })
                break;
            case 'wating_button_name':
                bot.sendMessage(userId,
                    `Button’s URL:`
                )
                buttonName = text
                userStates.set(userId, { step: "wating_button_url" })
                console.log("name of button", buttonName)
                break;
            case 'wating_button_url':
                buttonUrl = text
                resetUserState(userId)
                console.log("url of button", buttonUrl)
                userlist.forEach(user => {
                    addPost(bot, user.user_id, textPost, buttonName, buttonUrl)
                });
                userlist.forEach(userId => {
                    console.log(userId)
                });
                break;
        }
    }
});
const app = express();
app.use(cors());
app.use(express.json());
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
