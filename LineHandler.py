import datetime
import os

from WolframAPIClient import *
from functions import *
from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,JoinEvent, LeaveEvent, ImageSendMessage)

load_dotenv(verbose=True)
line_bot_api = LineBotApi(os.getenv('CHANNEL_ACCESS_TOKEN'))
handler = WebhookHandler(os.getenv('CHANNEL_SECRET'))


def reply_with_text(event_param, reply_text_param):
    line_bot_api.reply_message(
        event_param.reply_token,
        TextSendMessage(text=reply_text_param)
    )


def reply_with_image(event_param, reply_image_param):
    line_bot_api.reply_message(
        event_param.reply_token,
        ImageSendMessage(original_content_url=reply_image_param)
    )


def push_message(destination, message_type, message):
    if message_type == "text":
        line_bot_api.push_message(
            destination, TextSendMessage(text=message)
        )
    elif message_type == "image":
        line_bot_api.push_message(
            destination, ImageSendMessage(original_content_url=message, preview_image_url=message)
        )


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    msg_source = ""
    if event.source.type == "group":
        msg_source = event.source.group_id
    elif event.source.type == "user":
        msg_source = event.source.user_id
    profile = line_bot_api.get_profile(event.source.user_id)
    text = str(event.message.text).lower()
    command = text.strip('/')

    if text.startswith('/') is True:
        if command == "help":
            reply_with_text(event, get_help())
        elif command.startswith("solve") is True:
            # TODO: Make the Full Result API more functional (look at WolframAPIClient.py)

            reply_with_text(event, "Connecting to WolframAlpha...")
            query = command.strip("solve ")
            result_list = get_results(query)
            push_message(msg_source, "text", "Real Solution:" + "\n" + " , ".join(result_list[:-1]))# Get all but last element
            push_message(msg_source, "text", "Graphical plot:")
            push_message(msg_source, "image", result_list[-1])
        else:
            reply_with_text(event, "This command hasn\'t been implemented yet..")
    else:
        reply_with_text(event, "Unknown message. Command message should start with '/'. Reply with /help to get more information.")
