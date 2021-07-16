import { EventEmitter2 } from "eventemitter2";
import { Telegraf } from "telegraf";
import { measureMemory } from "vm";
export default class TelegramBot {
  private client: Telegraf;
  private emitter: EventEmitter2;
  constructor(emitter: EventEmitter2) {
    this.client = new Telegraf(process.env.TELEGRAM_KEY!);
    this.emitter = emitter;

    this.emitter.emit(["telegram.ready.event", `${this.client.botInfo?.id}`]);
    this.setupEmitters();
    this.client.launch();
    process.once("SIGINT", () => this.client.stop("SIGINT"));
    process.once("SIGTERM", () => this.client.stop("SIGTERM"));
  }

  setupEmitters(): void {
    this.client.on("message", (ctx) => {
      this.emitter.emit(`telegram.message.event`, ctx.message);
    });
  }

  async sendMessage(telegramId: string, message: string) {
    if (!message.startsWith("From: Space-Overlord")) {
      await this.client.telegram.sendMessage(telegramId, message);
  }
}
}
