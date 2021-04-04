import {
    middleware,
    MessageEvent,
    MiddlewareConfig,
    JSONParseError,
    WebhookRequestBody, TextMessage, ReplyableEvent, MessageAPIResponseBase
} from '@line/bot-sdk';
import express, {} from "express";
import {commandType, helpMessage, lineConfig} from "./constants";
import {extractCommand, linePromiseReply} from "./functions";
import {isMARBPRomiseAndNotUndefined} from "./utils";

const server = express();

const handleEvent = ({events}: WebhookRequestBody): Array<Promise<MessageAPIResponseBase>> =>
    events.map(webhookEvent => {
        switch (webhookEvent.type) {
            case "message":
                switch ((<MessageEvent>webhookEvent).message.type) {
                    case "text":
                        switch (extractCommand((<TextMessage>(<MessageEvent>webhookEvent).message).text)) {
                            case commandType.HELP:
                                return linePromiseReply(<ReplyableEvent>webhookEvent, helpMessage);
                            case commandType.MCSTATUS:
                                break;
                            case commandType.INVALID:
                                return linePromiseReply(<ReplyableEvent>webhookEvent, "Invalid command. Type /help to get some help");
                        }
                }
                break;
            default:
                return undefined;
        }
    }).filter(isMARBPRomiseAndNotUndefined);



server.post("/webhook", middleware(<MiddlewareConfig>lineConfig), (req, res) => {
    Promise
        .all(handleEvent(<WebhookRequestBody>req.body))
        .then(res.json)
        .catch(reason => {
            res.status(400);
            console.error(reason);
            if (reason instanceof JSONParseError) {
                res.json(reason);
            } else res.send(reason);
        });
});

server.get('/', (req, res) => {
    res.send("Meow");
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`listening on ${port}`);
});