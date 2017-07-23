# Mental Health Triage Chatbot

This is some preliminary work for the MH triage chatbot. 

The gad-7, phq-9, and introductory questions are each split into their own dialog. 

At the moment, the user is provided with a list of possible responses to each of the gad-7 and phq-9 questions, with the response options being derived from the physical questionnaires. Each of the response options is correlated to a score and, at the end of the questionnaire, each score is added up to give a total score. This score is correlated to the severity of anxiety/depression reported as per the guidelines of the gad-7 and phq-9. 

Both the final score and the correlated severity is given to the user in this version of the bot, but the correlated severity will not be visible in the final bot. 

# Deployment

Currently, this bot is not deployed but runs locally on the Microsoft Bot Framework Emulator.