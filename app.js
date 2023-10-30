const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000; 

const TelegramBot = require('node-telegram-bot-api');

// Models
const details = require('./models/resumeDetail');

// Controllers
const resumeController = require('./controllers/resumeController');

// Routes
const resumeRouter = require('./routes/resume');
const router = require('./routes/resume');

app.use(resumeRouter);
app.use(details);

app.use(express.static('public'));

const TOKEN = process.env.TELEGRAM_TOKEN || '6842036257:AAFvITVr60QqxmOGDWlu_a_wooSwbY3XTaI';

// ************* Bot
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/start/, (msg) => {
    startMenu(msg);
  });

function startMenu(msg) {
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: "generate resume" }, { text: "👨🏽‍💻 developer" }],
          [{ text: "Back" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    };
    bot.sendMessage(msg.chat.id, " start menu ", opts);
}

bot.onText(/generate resume/,(msg)=> {
   // bot.sendMessage(msg.chat.id, " worked ");
    askDetails(msg);
});

// Define a conversation state object to store user inputs
const conversationState = {};

function askDetails(msg){
    conversationState[msg.chat.id] = {
        step: 1, // Current step in the conversation
        fullName: "",
        jobTitle:"",
        phone:"",
        email:""
    };

    askFullName(msg.chat.id);
}

function askFullName(chatId) {
    bot.sendMessage(chatId, "Enter your full name:", {
        reply_markup: { force_reply: true },
    });
}

function askJobTitle(chatId) {
    bot.sendMessage(chatId, "Enter job title:", {
        reply_markup: { force_reply: true },
    });
}

function askPhone(chatId) {
    bot.sendMessage(chatId, "Enter your phone number:", {
        reply_markup: { force_reply: true },
    });
}



function askEmail(chatId) {
    bot.sendMessage(chatId, "Enter your email:", {
        reply_markup: { force_reply: true },
    });
}

// Handle user replies
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userState = conversationState[chatId];

    if (userState) {
        switch (userState.step) {
            case 1:
                userState.fullName = msg.text;
                userState.step++;
                askJobTitle(chatId);
                break;
            case 2:
                userState.jobTitle = msg.text;
                userState.step++;
                askPhone(chatId);
                break;
            case 2:
                userState.phone = msg.text;
                userState.step++;
                askEmail(chatId);
                break;
            case 3:
                userState.email = msg.text;
                userState.step++;
                userState.email = msg.text;

                // You now have all the user inputs in userState
                const { fullName,jobTitle,phone,email} = userState;
                console.log( fullName, jobTitle, phone, email);
                break;
        }
    }
});

bot.onText(/developer/, (msg) => {
    bot.sendMessage(msg.chat.id, "Developed By: Yididiya Kassahun\n\n ");
  });
  
bot.onText(/back/, (msg) => {
    startMenu(msg);
  });

//mongoose.connect('mongodb+srv://yididiya:mnYxZgzDQhULh2Ow@cluster0.de0jhxk.mongodb.net/shekilaStock-DB?retryWrites=true&w=majority').then(result=> {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
// }).catch(err=> {
//   console.log(err);
// })
