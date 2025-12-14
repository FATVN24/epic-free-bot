import fetch from "node-fetch";
import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

let lastGame = "";

client.once("ready", () => {
  console.log(`Bot online: ${client.user.tag}`);
});

cron.schedule("*/30 * * * *", async () => {
  try {
    const res = await fetch(
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions"
    );
    const data = await res.json();

    const games = data.data.Catalog.searchStore.elements;
    const freeGame = games.find(
      g => g.promotions?.promotionalOffers?.length
    );

    if (!freeGame || freeGame.title === lastGame) return;

    lastGame = freeGame.title;

    const channel = await client.channels.fetch(CHANNEL_ID);
    channel.send(
      `🎮 **Epic Games FREE!**\n**${freeGame.title}**\nhttps://store.epicgames.com/`
    );
  } catch (err) {
    console.error(err);
  }
});

client.login(TOKEN);
