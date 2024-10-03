module.exports = {
 config: {
 name: "❤️",
 version: "1",
 author: "thea",
 countDown: 5,
 role: 0,
 shortDescription: "love darling ",
 longDescription: "no prefix",
 category: "no prefix",
 }, 
 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "❤️") {
 return message.reply({
 body: "❤️",
 attachment: await global.utils.getStreamFromURL("https://i.ibb.co/9t5DYfg/image.jpg")
 });
 }
 }
}
