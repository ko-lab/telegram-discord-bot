import { Client, Message, TextChannel } from "discord.js";
import { EventEmitter2 } from "eventemitter2";
const util = require("util");
export default class DiscordBot {
  private client: Client;
  private emitter;
  constructor(emitter: EventEmitter2) {
    this.client = new Client();
    this.emitter = emitter;

    this.client.login(process.env.DISCORD_KEY);
    this.setupEmitters();

    process.once("SIGINT", () => this.client.destroy());
  }

  setupEmitters(): void {
    this.client.on("ready", () => {
      this.emitter.emit("discord.ready.event", this.client.user!.tag);
    });
    this.client.on("message", (message: Message) => {
      this.emitter.emit(`discord.message.event`, message, message.channel.id);
    });
    this.client.on("channelCreate", (channel) => {
      const channelName = (channel as TextChannel).name;
      this.emitter.emit(
        `discord.created.event`,
        channel as TextChannel,
        channelName
      );
    });
  }

  sendMessage(discordId: string, message: any) {
    this.client.channels.fetch(discordId, true).then((channel) => {
      if (channel) {
        console.log(" sending message to ->", (channel as TextChannel).name);
        const a = JSON.stringify(message);
        console.log(a);
        (channel as TextChannel).send(message);
      }
    });
  }
}
