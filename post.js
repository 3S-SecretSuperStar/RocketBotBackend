function addPost(bot, chatId, text, buttonName, buttonUrl) {
  console.log("add post");

  console.log(bot, chatId, text, buttonName, buttonUrl)
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
  bot.sendMessage(chatId, text, options);
}
module.exports = { addPost };