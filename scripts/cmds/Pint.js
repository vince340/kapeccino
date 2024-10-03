const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "pinterest",
		aliases: ["pin", "Pint"],
		version: "1",
		author: "esther",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Image Pinterest Search 📷",
			en: "Image Pinterest Search 📸"
		},
		longDescription: {
			en: "Pinterest image search."
		},
		category: "image",
		guide: {
			en: "{prefix}pinterest <search query> -<number of images>"
		}
	},

	onStart: async function ({ api, event, args, usersData }) {
		try {
			const userID = event.senderID;

			const keySearch = args.join(" ");
			if (!keySearch.includes("-")) {
				return api.sendMessage(`♻️ 𝗖𝗛𝗘𝗖𝗞𝗜𝗡𝗚 ♻️\n-------------------------------\nExample: Pinterest Kakashi - 10\n (Specify how many images you want to appear in the result)`, event.threadID, event.messageID);
			}
			const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
			const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 6;

			const res = await axios.get(`https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(keySearchs)}`);
			const data = res.data;

			if (!data || !Array.isArray(data) || data.length === 0) {
				return api.sendMessage(`No image data found for "${keySearchs}". Please try another search query.`, event.threadID, event.messageID);
			}

			const imgData = [];

			for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
				const imageUrl = data[i].image;

				try {
					const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
					const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
					await fs.outputFile(imgPath, imgResponse.data);
					imgData.push(fs.createReadStream(imgPath));
				} catch (error) {
					console.error(error);
					// Handle image fetching errors (skip the problematic image)
				}
			}

			await api.sendMessage({
				attachment: imgData,
				body: `-- 𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏 -- 🖼️ [${imgData.length}]\n[🖼️] "${keySearchs}":`
			}, event.threadID, event.messageID);

			await fs.remove(path.join(__dirname, 'cache'));
		} catch (error) {
			console.error(error);
			return api.sendMessage(`An error occurred. Please try again later.`, event.threadID, event.messageID);
		}
	}
};
