async function addPost(bot, chatId, text, buttonName, buttonUrl,index) {
    // console.log( chatId, text, buttonName, buttonUrl)
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: buttonName,
                        url: buttonUrl // Replace with your channel's link
                    }
                ]

            ]
        }
    };
    try{
        await bot.sendMessage(chatId, text, options);
    }
    catch (error) {
        if (error.code === 'ECONNRESET') {
            console.warn('Connection reset, retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
        } else {
            console.error('Error sending message:', error.message);
            console.error('chatId:', chatId);
            // break; // Exit on other errors
        }
    }

}
module.exports = { addPost };