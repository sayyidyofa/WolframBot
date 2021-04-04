import {Config} from "@line/bot-sdk";

export const lineConfig = <Config>{
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: process.env.CHANNEL_SECRET || 'YOUR_CHANNEL_SECRET'
}

export enum commandType {
    HELP,
    MCSTATUS,
    INVALID
}

export const helpMessage = "" +
    "Command list:\n" +
    "/help Display this message\n" +
    "/mcstatus Check the status of my master's Minecraft Server\n";