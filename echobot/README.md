# echobot

A multi-platform chatbot (Web, Skype, Facebook Messenger, SMS) that echoes back to the user what they have said, preceded by "You said". Forked from [fuselabs](https://github.com/fuselabs/echobot) for the purposes of testing deployment to the aforementioned channels. 

The web chat and skype channels for this particular bot are available [here](http://testdeploybotapp.azurewebsites.net).

![Echobot on Facebook Messenger](echoBot_screenshot.jpg?raw=true "EchoBot")
Echobot as rendered on Facebook Messenger

# Installing

## Prerequisties

1. Install [node.js and npm](https://nodejs.org/en/)
2. Install the [Microsoft Bot Framework](https://github.com/Microsoft/BotFramework-Emulator/releases)

## Installation

1. Clone this repository
2. In terminal, run `npm install` 
3. In terminal, run `node ./server.js`
4. Visit [http://localhost:3978/](http://localhost:3978/) to communicate with the bot.
5. Remove the appId and appPassword in the *server.js* file. These will be populated again later with values obtained from registering with the bot framework.
6. To test in the Bot Framework Emulator, use http://localhost:3978/api/message for endpoint URL. Leave Microsoft App ID and Microsoft App Password blank for local testing.

# Deployment

## Deployment to Azure

1. Create an Azure Web App [Azure Portal](https://portal.azure.com) -> Marketplace -> Web + Mobile -> Web App
2. Set up deployment to Azure from Github repo (YourWebApp -> Deployment options -> GitHub)
3. Note down the URL provided in *Overview*
4. Register the bot with the [Microsoft Bot Framework](http://docs.botframework.com/connector/getstarted/#registering-your-bot-with-the-microsoft-bot-framework). For the endpoint URL, use the URL from step (3), but replace `http` with `https` and add `/api/messages` to the end of the URL.
5. From the Bot Framework, note down the App ID and App Secret.
6. In the Web App *Application Settings -> App Settings* in the [Azure Portal](https://portal.azure.com), create new keys entitled MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD and populate their associated values with the values noted in step (5).
7. The Bot Framework allows for [testing bot connection](http://docs.botframework.com/connector/getstarted/#testing-the-connection-to-your-bot)

## Connection to Channels

### Web Chat

1. In the [Microsoft Bot Framework](https://dev.botframework.com/bots), select the bot and navigate to the *Channels* section and click *Edit* beside Web Chat.
2. Copy one of the *Secret Keys* provided into the YOUR_SECRET_HERE in the *Embed code*. 
3. Paste the embed code onto your website. Note that this will expose the secret key generally.

It is also possible to embed the code into a website without revealing the secret key - instructions [here](https://docs.microsoft.com/en-gb/bot-framework/channel-connect-webchat)

More detailed instructions on connecting a bot to a web chat may be found in the relevant [docs](https://docs.microsoft.com/en-gb/bot-framework/channel-connect-webchat)

## Skype

1. In the [Microsoft Bot Framework](https://dev.botframework.com/), select the bot and navigate to the *Channels* section and click *Edit* beside Skype.
2. Click *Get Embed Code* and copy and paste this onto your website.

## Facebook Messenger

1. Go to [Facebook](https://www.facebook.com) and create a page.
2. Copy and save the Page ID from the page's *About* page.
3. [Create a Facebook App](https://developers.facebook.com/) and get the **App ID** and **App Secret**
4. For the app, enable Facebook Messenger.
5. Generate and note the **Page Access Token** for the page created.
6. Get the **Callback URL** and **Verify Tokens** from the [Microsoft Bot Framework](https://dev.botframework.com/).
7. Paste the tokens from step (6) into Facebook Messenger and tick the following in subscription fields: *message_deliveries, messaging_options, messaging_postbacks.
8. [Bot Framework Portal](https://dev.botframework.com/), paste: **Page ID, App ID, App Secret** and **Page Access Token**

The above is adapted from the relevant [docs](https://docs.microsoft.com/en-gb/bot-framework/channel-connect-facebook), which contain further details.

## Twilio SMS

1. Create a [Twilio](https://www.twilio.com) account
2. Create a Twilio App with the Request URL set to *https://sms.botframework.com/api/sms*. Go to: Console -> All Products and Services -> Programmable SMS -> Tools 
3. Get or add a phone number: Console -> All Products and Services -> Phone Numbers. Note down this **phone number**.
4. For the relevant Phone Number, configure the *Voice* and *Messaging* to the created Twilio App. 
4. In the App, leave **Voice* *Request URL* blank and set the *Request URL* for *Messaging* to https://sms.botframework.com/api/sms
5. From the Console Dashboard, get the **Account SID** and **Auth Token**
6. Put the **Phone Number**, **Account SID**, and **Auth Token** to the Twilio Bot Credentials in the [Bot Framework](https://dev.botframework.com/).

The above is adapted from the relevant [docs](https://docs.microsoft.com/en-gb/bot-framework/channel-connect-twilio)

# Built With

* [Node JS](https://nodejs.org/en/)

# Acknowledgements

This project was forked from Microsoft Fuse Labs and the original may be found [here](https://github.com/fuselabs/echobot). 

The code was not altered but an appId and appPassword were added to the server.js file.


A sample bot forked from fuselabs (https://github.com/fuselabs/echobot). A simple bot that echoes back to the user what they have said, preceded by "You said".

The purpose of using this sample was to test deployment to a variety of major messaging services.

A MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD were obtained by registering the bot with the Microsoft Bot Framework (https://dev.botframework.com).

Deployment was via the instructions given in the README.md for the original sample (see below).

The bot was connected and tested on the following channels following the instructions given in the linked docs:

- Web Chat (https://docs.microsoft.com/en-gb/bot-framework/channel-connect-webchat)
- Skype 
- Twilio SMS (https://docs.microsoft.com/en-gb/bot-framework/channel-connect-twilio)
- Facebook Messenger (https://docs.microsoft.com/en-gb/bot-framework/channel-connect-facebook)

The README.md for the sample from which this was forked is below.

# echobot
A sample bot for getting started with Bot Framework

This repo is an example of using Node.js to build a bot, which is hosted on Azure and uses continuous deployment from Github.

Here's how to use this bot as a starter template for your own Node.js based bot:

*note: in the examples below, replace "echobotsamplev3" with your bot ID for any settings or URLs.*

1. Fork this repo.
2. Create an Azure web app.
![](images/azure-create-webapp.png?raw=true)
3. Set up continuous deployment to Azure from your Github repo. You will be asked to authorize Azure access to your GitHub repo, and then choose your branch from which to deploy.
![](images/azure-deployment.png?raw=true)
4. Verify the deployment has completed by visiting the web app. [http://echobotsamplev3.azurewebsites.net/](https://echobotsamplev3.azurewebsites.net/). It may take a minute of two for the initial fetch and build from your repo.
![](images/azure-browse.png?raw=true)
5. [Register your bot with the Bot Framework](http://docs.botframework.com/connector/getstarted/#registering-your-bot-with-the-microsoft-bot-framework) using **https://echobotsamplev3.azurewebsites.net/api/messages** as your endpoint.
6. Enter your Bot Framework App ID and App Secret into Azure settings.
![](images/azure-secrets.png?raw=true)
7. [Test the connection to your bot](http://docs.botframework.com/connector/getstarted/#testing-the-connection-to-your-bot) from the Bot Framework developer portal.

##Testing locally
* git clone this repo.
* npm install
* node ./server.js
* Visit [http://localhost:3978/](http://localhost:3978/) to see the home page.
* Use **http://localhost:3978/api/messages** in the [Bot Framework Emulator](http://docs.botframework.com/connector/tools/bot-framework-emulator/#navtitle)
   
##Helpful hints:
* Your web app will deploy whenever you git push to your repo. Changing the text of your index.html and visiting your homepage is a simple way to see that your latest deployment has been published to Azure.
* Azure "knows" your app is a NodeJs app by the presence of the "server.js" file. Renaming this file may possibly cause Azure to not execute NodeJs code.
* Azure app settings become NodeJS process.env variables.
* Use https when specifying URLs in the Bot Framework developer portal. Your app secret will not be transmitted unless it is secure.
