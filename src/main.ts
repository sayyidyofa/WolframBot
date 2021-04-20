import {
    Client,
    middleware,
    MessageEvent,
    Config,
    ClientConfig,
    MiddlewareConfig,
    JSONParseError,
    WebhookRequestBody, TextMessage, ReplyableEvent, MessageAPIResponseBase, Group, Room
} from '@line/bot-sdk';
import {Error, Info, Pod, QueryResult, Sound, State, SubPod, WolframClient} from 'node-wolfram-alpha';
import express from 'express';

const wolrfamClient = new WolframClient(process.env.APP_ID || 'YOUR_APP_ID');

const server = express();

const lineConfig = <Config>{
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: process.env.CHANNEL_SECRET || 'YOUR_CHANNEL_SECRET'
};
const lineClient = new Client(<ClientConfig>lineConfig);

enum commandType {
    HELP,
    SOLVE,
    INVALID
}

const extractCommand = (message: string): commandType => {
    if (message.indexOf("/help") !== -1) return commandType.HELP;
    else if (message.indexOf("/solve") !== -1) return commandType.SOLVE;
    else return commandType.INVALID;
};

const lineTextReply = (event: ReplyableEvent, text: string): Promise<MessageAPIResponseBase> => {
    return lineClient.replyMessage(event.replyToken, <TextMessage> {
        type: "text",
        text: text
    });
};

const lineTextPushReply = (to: string, text: string): Promise<MessageAPIResponseBase> =>
    lineClient.pushMessage(to, <TextMessage>{
        type: "text",
        text: text
    });

const helpMessage = "" +
    "Command list:\n" +
    "/help Display this message\n" +
    "/solve Solve math equations. Ex: /solve x^2 - y^2 + 1 = 0\n";

interface IntegerSolutionPod extends Pod {
    error: false | Error;
    id: "IntegerSolution";
    infos?: Array<Info>;
    numsubpods: number;
    position: boolean;
    scanner: string;
    sounds?: Array<Sound>;
    states: Array<State>;
    subpods: Array<SubPod>;
    title: string;
}

const isStringAndNotUndef = (teks: string | undefined): teks is string => !!teks;

const isPodAndNotUndef = (lePod: IntegerSolutionPod | undefined): lePod is IntegerSolutionPod => !!lePod;

const handleLineEvents = ({events}: WebhookRequestBody): Array<Promise<MessageAPIResponseBase> | undefined> =>
    events.map(webhookEvent => {
        switch (webhookEvent.source.type) {
            case "user":
                switch (webhookEvent.type) {
                    case "message":
                        switch ((<MessageEvent>webhookEvent).message.type) {
                            case "text":
                                switch (extractCommand((<TextMessage>(<MessageEvent>webhookEvent).message).text)) {
                                    case commandType.HELP:
                                        return lineTextReply(<ReplyableEvent>webhookEvent, helpMessage);
                                    case commandType.SOLVE:
                                        return wolrfamClient.query((<TextMessage>(<MessageEvent>webhookEvent).message).text.replace("/solve ", ""), {includepodid: "IntegerSolution"})
                                        .then(response => lineTextReply(<ReplyableEvent>webhookEvent, response.data.queryresult.pods
                                            .map(pod => pod.id === "IntegerSolution" ? <IntegerSolutionPod>pod : undefined)
                                            .filter(isPodAndNotUndef)
                                            .reduce((_, pod) => pod).subpods
                                            .map(subpod => subpod.plaintext)
                                            .filter(isStringAndNotUndef)
                                            .reduce((acc, val) => acc + ", " + val))
                                        )
                                        .catch(reason => lineTextReply(<ReplyableEvent>webhookEvent, JSON.stringify(reason)));
                                    case commandType.INVALID:
                                        return lineTextReply(<ReplyableEvent>webhookEvent, "Invalid command. Type /help to get some help");
                                }
                                break;
                            default:
                                return lineTextReply(<ReplyableEvent>webhookEvent, "All messages other than text are not supported. Type /help to get some help");
                        }
                        break;
                    default:
                        return lineTextReply(<ReplyableEvent>webhookEvent, "All events other than message event are not supported. Type /help to get some help");
                }
                break;
            case "group":
                return lineTextPushReply((<Group>webhookEvent.source).groupId, "Commands from groups are not supported. Individual services only.");
            case "room":
                return lineTextPushReply((<Room>webhookEvent.source).roomId, "Commands from rooms are not supported. Individual services only.");
        }
    });

server.post("/webhook", middleware(<MiddlewareConfig>lineConfig), (req, res) => {
    Promise
        .all(handleLineEvents(<WebhookRequestBody>req.body).filter(v => !!v))
        .then(res.json)
        .catch(reason => {
            res.status(400);
            console.error(reason);
            if (reason instanceof JSONParseError) {
                res.json(reason);
            } else res.send(reason);
        });
});

server.get('/', (_, res) => {
    res.send("I am wolframbot");
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`listening on ${port}`);
});
