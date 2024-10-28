const fs = require('fs');
const path = require('path');

async function addPost(bot, chatId, text, buttonName, buttonUrl, index, fileData) {
    // console.log( chatId, text, buttonName, buttonUrl)
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: buttonName,
                        url: "https://dashboard.render.com/web/srv-cr726btds78s738a033g/goToChannel", // Replace with your channel's link
                    }
                ]

            ]
        }
    };
    console.log("index", chatId);
    try {
        if (fileData) {
            await bot.sendPhoto(chatId, fileData, {
                caption: text,
                reply_markup: options.reply_markup,
            });
        } else {
            await bot.sendMessage(chatId, text, options);
        }
    }
    catch (error) {
        if (error.code === 'ECONNRESET') {
            logMessage(`ECONNRESET ${error.message} : ${chatId}`);
            console.error(`ECONNRESET ${error.message} : ${chatId}`);
            console.warn('Connection reset, retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
        } else {
            logMessage(`Error sending message: ${error.message} : ${chatId}`);
            console.error(`Error sending message: ${error.message} : ${chatId}`);
            // break; // Exit on other errors
        }
    }
}

// Specify the log file path
const logFilePath = path.join("/var/data/", 'dev.log');

// Function to write logs
function logMessage(message) {
    const timestamp = new Date().toISOString(); // Create a timestamp
    const logEntry = `${timestamp} - ${message}\n`; // Format the log entry

    // Append the log entry to the log file
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}
module.exports = { addPost, logMessage };