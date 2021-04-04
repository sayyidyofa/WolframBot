import {MessageAPIResponseBase} from "@line/bot-sdk";

export function hasProperties <T>(leObject: T): leObject is T {
    return leObject && Object.keys(leObject).length > 0;
}

export function isMARBPRomiseAndNotUndefined (promise: Promise<MessageAPIResponseBase> | undefined): promise is Promise<MessageAPIResponseBase> {
    return !!promise;
}