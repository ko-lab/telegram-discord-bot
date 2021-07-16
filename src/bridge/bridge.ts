import { Message } from "discord.js";
import { EventEmitter2 } from "eventemitter2";
import DataStore from "nedb";
import { Chat } from "typegram";
import DiscordBot from "../discord/bot";
import TelegramBot from "../telegram/bot";

export default class Bridge {
  private eventListener: EventEmitter2;
  private db: DataStore;
  private discordBot: DiscordBot;
  private telegramBot: TelegramBot;

  constructor(
    emitter: EventEmitter2,
    datastore: DataStore,
    discord: DiscordBot,
    telegram: TelegramBot
  ) {
    this.eventListener = emitter;
    this.db = datastore;
    this.discordBot = discord;
    this.telegramBot = telegram;

    this.setupListeners();
  }

  setupListeners(): void {
    this.eventListener.on("discord.ready.event", (t) => {
      console.log("Discord listener == on");
    });

    this.setupChatListeners();
  }
  setupChatListeners() {
    this.eventListener.on(
      "discord.message.event",
      (message: Message, channelName) => {
        console.log(channelName);
        this.db.findOne({ channel: channelName }, (err, docs: any) => {
          if (docs) {
            this.telegramBot.sendMessage(
              docs.telegramId,
              "From: " + message.author.username + "\n" + message.content
            );
          }
        });
      }
    );
    this.eventListener.on("telegram.message.event", (ctx) => {
      this.db.findOne({ telegramId: "" + ctx.chat.id }, (err, docs: any) => {
        if (docs) {
          this.discordBot.sendMessage(
            docs.channel,
            "From: " + ctx.from.username + "\n" + ctx.text
          );
        }
      });
    });
  }
}
