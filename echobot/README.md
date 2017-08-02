# echobot - forked from Microft Bot Samples.

# This is a chatbot that echoes back to the user what they have said, preceded by "You said".

![Alt text](/echoBot_screenshot.png?raw=true "EchoBot")

Testing changes on branch.

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
