const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000; 

const TelegramBot = require('node-telegram-bot-api');

// controller 
const resumeController = require('./controllers/resume');
// Models
const ResumeDetail = require('./models/resumeDetail');

// Routes
const resumeRouter = require('./routes/resume');

app.use(express.static('public'));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(resumeRouter);
app.use(ResumeDetail);

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
          [{ text: "👨🏽‍💻 Generate Resume" }, { text: "👨🏽‍💻 developer" }],
          [{text:"🗑️ Delete Resume"},{ text: "🔙 Back" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    };
    bot.sendMessage(msg.chat.id, " start menu ", opts);
}

bot.onText(/Generate Resume/,(msg)=> {
    askDetails(msg);
});

bot.onText(/Delete Resume/,(msg)=> {
    deleteResume(msg);
});

// Define a conversation state object to store user inputs
const conversationState = {};

function askDetails(msg){
    conversationState[msg.chat.id] = {
        step: 1, // Current step in the conversation
        fullName: "",
        jobTitle:"",
        age:"",
        email:"",
        phone:"",
        address:""
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

function askAge(chatId) {
    bot.sendMessage(chatId, "Enter your Age:", {
        reply_markup: { force_reply: true },
    });
}
function askEmail(chatId) {
    bot.sendMessage(chatId, "Enter your email:", {
        reply_markup: { force_reply: true },
    });
}
function askPhone(chatId) {
    bot.sendMessage(chatId, "Enter your phone number:", {
        reply_markup: { force_reply: true },
    });
}

function askAddress(chatId) {
    bot.sendMessage(chatId, "Enter your Address:", {
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
                askAge(chatId);
                break;
            case 3:
                userState.age = msg.text;
                userState.step++;
                askEmail(chatId);
                break;
            case 4:
                userState.email = msg.text;
                userState.step++;
                askPhone(chatId);
                break;
            case 5:
                userState.phone = msg.text;
                userState.step++;
                askAddress(chatId);
                break;
            case 6:
                userState.address = msg.text;
                userState.step++;
 
                // You now have all the user inputs in userState
                const { fullName,jobTitle,age,email,phone,address} = userState;
                console.log(fullName,jobTitle,age,email,phone,address);
                const dataResult = addResumeDetail(chatId,fullName, jobTitle,age, email, phone,address);
                
                if(!dataResult){
                    bot.sendMessage(msg.chat.id,"profile exist. please delete it to create another");
                }else{
                    const link = `https://a0b5-196-191-190-41.ngrok-free.app/get.resume/${chatId}`; // test it with ngrok
                    bot.sendMessage(msg.chat.id, `<a href="${link}">Check out this link</a>`, { parse_mode: 'HTML'});
                }

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

function addResumeDetail(chatId,fullName,jobTitle,age,email,phone,address){
    const ChatId = chatId.toString();
    const FullName = fullName.toString();
    const JobTitle = jobTitle.toString();
    const Age = age.toString();
    const Email = email.toString();
    const Phone = phone.toString();
    const Address = address.toString();

    let state;

    ResumeDetail.findOne({chatId:ChatId})
    .then(result=>{
        if(result){
            return state = true;
        }else{
            const details = new ResumeDetail({
                chatId:ChatId,
                fullName:FullName,
                jobTitle:JobTitle,
                age:Age,
                email:Email,
                phone:Phone,
                address:Address
             })
          
             details.save();
             return state = false;
        }
    })
  
}

function deleteResume(chatId){
  //  ResumeDetail.findOne({chat})
}

mongoose.connect('mongodb+srv://yididiya:mnYxZgzDQhULh2Ow@cluster0.de0jhxk.mongodb.net/resume-DB?retryWrites=true&w=majority').then(result=> {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err=> {
  console.log(err);
})
