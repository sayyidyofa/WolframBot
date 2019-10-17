"""Handler For Flask App"""

from flask import Flask, request, abort
from flask.logging import create_logger
from cryptography.exceptions import InvalidSignature
from LineHandler import handler, os

APP = Flask(__name__)
LOG = create_logger(APP)


@APP.route('/')
def hello_world():
    """Hello world function"""
    return 'Hello World! Testing deployer(again)'


@APP.route('/callback', methods=['POST'])
def callback():
    """Callback Function"""
    # get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

    # get request body as text
    body = request.get_data(as_text=True)
    LOG.debug("Request Body:" + body)

    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignature:
        print("Invalid signature. Please check your channel access token and/or channel secret.")
        abort(400)

    return 'OK'


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5000))
    APP.run(host='0.0.0.0', port=PORT, debug=True)
