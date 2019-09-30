import urllib.parse
import requests


from dotenv import load_dotenv

import os
import json

# URL constants

load_dotenv(verbose=True)

API_URL = "http://api.wolframalpha.com/v2/query?"
APPID = os.getenv("WOLFRAM_APP_ID")


def encode_url(string):
    return urllib.parse.quote(string)


def getResults(input, format="image,plaintext", output="json"):
    response = requests.get(
        API_URL +
        "appid=" + APPID + "&" +
        "input=" + encode_url(input) + "&" +
        "format=" + format + "&" +
        "output=" + output
    )
    json_data = json.loads(response.text)
    print("\n", type(json_data), "\n")
    print(json_data)
    return str(json_data)
