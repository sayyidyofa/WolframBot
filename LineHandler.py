import datetime
import os

from WolframAPIClient import *
from linebot.exceptions import InvalidSignatureError
from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    JoinEvent, LeaveEvent)

load_dotenv(verbose=True)
line_bot_api = LineBotApi(os.getenv('CHANNEL_ACCESS_TOKEN'))
handler = WebhookHandler(os.getenv('CHANNEL_SECRET'))


def reply_with_text(event_param, reply_text_param):
    line_bot_api.reply_message(
        event_param.reply_token,
        TextSendMessage(text=reply_text_param)
    )


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    profile = line_bot_api.get_profile(event.source.user_id)
    text = str(event.message.text).lower()
    command = text.strip('/')

    if text.startswith('/') is True:
        if command == "help":
            reply_with_text(event, "Not built yet!")
        elif command.startswith("solve") is True:
            reply_with_text(event, getResults(command.strip("solve ")))
        else:
            reply_with_text(event, "This command hasn\'t been implemented yet...for now")


@handler.add(JoinEvent)
def handle_join(event):
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text='Joined this ' + event.source.type))


@handler.add(LeaveEvent)
def handle_leave():
    print(str(datetime.datetime.utcnow()) + " - Got event: leave group")