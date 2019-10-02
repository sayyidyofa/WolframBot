import urllib.parse
import requests


from dotenv import load_dotenv

import os
import json

# URL constants

load_dotenv(verbose=True)

API_FULL = "http://api.wolframalpha.com/v2/query?"
API_SIMPLE = "http://api.wolframalpha.com/v1/simple?"
APPID = os.getenv("WOLFRAM_APP_ID")


def encode_url(string):
    return urllib.parse.quote(string)


def get_results(input_param, real_solution=True, plot=True):
    """
    :param input_param: persamaan yg akan diselesaikan
    :param real_solution: apakah akar real akan ditampilkan?
    :param plot: apakah grafik persamaan akan ditampilkan?
    :return ret_list: isinya adalah semua real solution, index terakhir berisi url gambar plot
    """
    ret_list = []
    ret_str = ""
    response = requests.get(
        API_FULL +
        "appid=" + APPID + "&" +
        "input=" + encode_url(input_param) + "&" +
        "format=" + "image,plaintext" + "&" +
        "output=" + "json"
    ).json()
    if real_solution is True:
        for pod in response['queryresult']['pods']:
            if pod['title'] == "Real solutions" or pod['title'] == "Solutions":
                for subpod in pod['subpods']:
                    ret_list.append(subpod['img']['alt'])
    if plot is True:
        ret_list.append(response['queryresult']['pods'][2]['subpods'][0]['img']['src'])
    else:
        for pod in response['queryresult']['pods']:
            if pod['title'] == "Input":
                continue
            else:

                pass
            pass
        pass
    return ret_list
