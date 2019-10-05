### Still in development, read this before contributing:

Put a new `.env` file inside the main directory of the code,this file will be hosting the keys and credentials.

Right now the keys that are required to be present inside are as follows:
- `CHANNEL_ACCESS_TOKEN="..."` LINE Bot access token 
- `CHANNEL_SECRET="..."` LINE Bot channel secret 
- `WOLFRAM_APPID="..."` 

Wolfram Alpha API Key Other useful information can be found on the [wiki](https://github.com/sayyidyofa/WolframBot/wiki) 

Don't forget to install the modules required!
`pip3 install -r requirements.txt` 

Developing locally? Maybe `ngrok` can help