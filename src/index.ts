require("dotenv").config();
import { EventEmitter2 } from "eventemitter2";
import Bridge from "./bridge/bridge";
import DiscordBot from "./discord/bot";
import TelegramBot from "./telegram/bot";
const eventEmitter = new EventEmitter2();
const Datastore = require("nedb");
const db = new Datastore({
  filename: "./bridge_db",
  autoload: true,
  corruptAlertThreshold: 1,
});
const discord = new DiscordBot(eventEmitter);
const telegram = new TelegramBot(eventEmitter);
const bridge = new Bridge(eventEmitter, db, discord, telegram);
