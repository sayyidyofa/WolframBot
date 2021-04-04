import {commandType, lineConfig} from "./constants";
import {Client, ClientConfig, MessageAPIResponseBase, ReplyableEvent, TextMessage} from "@line/bot-sdk";

export function extractCommand (message: string): commandType {
    if (message.indexOf("/help") !== -1) return commandType.HELP;
    else if (message.indexOf("/mcstatus") !== -1) return commandType.MCSTATUS;
    else return commandType.INVALID;
}

export function linePromiseReply (event: ReplyableEvent, text: string, lineClient= new Client(<ClientConfig>lineConfig)): Promise<MessageAPIResponseBase> {
    return lineClient.replyMessage(event.replyToken, <TextMessage> {
        type: "text",
        text: text
    });
}

