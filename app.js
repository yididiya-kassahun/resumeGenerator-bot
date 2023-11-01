const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const qr = require('qrcode');
const app = express();
const port = 3000;

const TelegramBot = require("node-telegram-bot-api");

// controller
const resumeController = require("./controllers/resume");
// Models
const ResumeDetail = require("./models/resumeDetail");

// Routes
const resumeRouter = require("./routes/resume");

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(resumeRouter);
app.use(ResumeDetail);

const TOKEN =
  process.env.TELEGRAM_TOKEN ||
  "6842036257:AAFvITVr60QqxmOGDWlu_a_wooSwbY3XTaI";

// ************* Bot
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/start/, (msg) => {
  startMenu(msg);
});

function startMenu(msg) {
  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: "📄 Generate Resume" }, { text: "👨🏽‍💻 developer" }],
        [{ text: "🗑️ Delete Resume" }, { text: "🔙 Back" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  };
  bot.sendMessage(
    msg.chat.id,
    " start menu \n\n If you here created a resume you have to delete it first ",
    opts
  );
}

bot.onText(/Generate Resume/, (msg) => {
  askDetails(msg);
});

bot.onText(/Delete Resume/, (msg) => {
  deleteResume(msg.chat.id);
});

// Define a conversation state object to store user inputs
const conversationState = {};

function askDetails(msg) {
  conversationState[msg.chat.id] = {
    step: 1, // Current step in the conversation
    photoURL: "",
    aboutMe: "",
    fullName: "",
    jobTitle: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    professionalSkill:{
      title:"",
      skillLevel:""
    }
  };

  askPhoto(msg.chat.id);
}
function askPhoto(chatId) {
  bot.sendMessage(chatId, "Enter your photo NB: 500px by 500px:", {
    reply_markup: { force_reply: true },
  });
}

function askAboutMe(chatId) {
  bot.sendMessage(chatId, "Enter some details about you:", {
    reply_markup: { force_reply: true },
  });
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

// Define a function to start the conversation
function askProfessionalSkillTitle(chatId) {
  bot.sendMessage(chatId, "Enter your professional skill:", {
    reply_markup: { force_reply: true },
  });
}

function askProfessionalSkillLevel(chatId) {
  bot.sendMessage(chatId, "Enter your professional skill level:", {
    reply_markup: { force_reply: true },
  });
}

let photoPath;
let photoPathPromise;

bot.on("photo", (msg) => {
  const chatId = msg.chat.id;
  const photoId = msg.photo[0].file_id; // Get the file ID of the photo
  const caption = msg.caption || ""; // Get the caption (if any)

  // If you want to download or process the photo, you can use the getFile method
  bot.getFile(photoId).then((fileInfo) => {
    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${fileInfo.file_path}`;

    console.log("fileUrl " + fileUrl);
    const fileUrlWithSize = fileUrl.replace("file.jpg", "file_0.jpg");
    // Download the photo using axios
    axios({
      method: "get",
      url: fileUrlWithSize,
      responseType: "stream",
    }).then((response) => {
      // Specify the path where you want to save the downloaded photo
      photoPath = __dirname + `/public/photos/${chatId}.jpg`;

      // Create a writable stream to save the file
      const writer = fs.createWriteStream(photoPath);

      // Pipe the response stream to the writer
      response.data.pipe(writer);

      writer.on("finish", () => {
        console.log("Photo downloaded and saved at", photoPath);

        // Resolve the photoPathPromise when the photo has been saved
        if (photoPathPromise) {
          photoPathPromise.resolve(photoPath);
        }
      });

      writer.on("error", (error) => {
        console.error("Error downloading photo:", error);

        // Reject the photoPathPromise if there's an error
        if (photoPathPromise) {
          photoPathPromise.reject(error);
        }
      });
    });
  });
});

// Define a function to get the photoPath when it's available
function getPhotoPath() {
  if (photoPath) {
    // If photoPath is already available, return it immediately
    return Promise.resolve(photoPath);
  } else {
    // If photoPath is not available yet, create a promise for it
    if (!photoPathPromise) {
      photoPathPromise = {};
      photoPathPromise.promise = new Promise((resolve, reject) => {
        photoPathPromise.resolve = resolve;
        photoPathPromise.reject = reject;
      });
    }
    return photoPathPromise.promise;
  }
}

// Handle user replies
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userState = conversationState[chatId];

  getPhotoPath()
    .then((path) => {
      if (userState) {
        switch (userState.step) {
          case 1:
            userState.photoURL = path;
            userState.step++;
            askAboutMe(chatId);
            break;
          case 2:
            userState.aboutMe = msg.text;
            userState.step++;
            askFullName(chatId);
            break;
          case 3:
            userState.fullName = msg.text;
            userState.step++;
            askJobTitle(chatId);
            break;
          case 4:
            userState.jobTitle = msg.text;
            userState.step++;
            askAge(chatId);
            break;
          case 5:
            userState.age = msg.text;
            userState.step++;
            askEmail(chatId);
            break;
          case 6:
            userState.email = msg.text;
            userState.step++;
            askPhone(chatId);
            break;
          case 7:
            userState.phone = msg.text;
            userState.step++;
            askAddress(chatId);
            break;
          case 8:
            userState.address = msg.text;
            userState.step++;
            askProfessionalSkillTitle(chatId);
            break;
          case 9:
            userState.professionalSkill.title = msg.text;
            userState.step++;
            askProfessionalSkillLevel(chatId);
            break;
          case 10:
            userState.professionalSkill.skillLevel = msg.text;
            userState.step++;

            // You now have all the user inputs in userState
            const { photoURL,aboutMe, fullName, jobTitle, age, email, phone, address,professionalSkill } =
              userState;
            console.log(
              "console log ... " + photoURL,
              fullName,
              jobTitle,
              age,
              email,
              phone,
              address,
              professionalSkill
            );
            const dataResult = addResumeDetail(
              chatId,
              photoURL,
              aboutMe,
              fullName,
              jobTitle,
              age,
              email,
              phone,
              address,
              professionalSkill
            );

            if (dataResult) {
              bot.sendMessage(
                msg.chat.id,
                "profile exist. please delete it to create another"
              );
            } else {
              const link = `https://bb0e-196-189-243-16.ngrok-free.app/get.resume/${chatId}`; // test it with ngrok

              bot.sendMessage(
                msg.chat.id,
                `Congradulation 🎉 Your Resume profile is Ready! \n\nclick the link or scan the QR Code \n<a href="${link}">Check out this link</a>`,
                { parse_mode: "HTML" }
              );

              // generate qr code for the link
              let data = {
                "link":`${link}`
              };
              let filename = 'qrCode.png';

              let stJson = JSON.stringify(data);
              qr.toDataURL(stJson,function(err,base64Data){
                if(err)return console.log(err);
                //console.log(code);
                sendBase64File(chatId, base64Data, filename);
              })

            }

            break;
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

bot.onText(/developer/, (msg) => {
  bot.sendMessage(msg.chat.id, "Developed By: Yididiya Kassahun\n\n ");
});

bot.onText(/back/, (msg) => {
  startMenu(msg);
});

function addResumeDetail(
  chatId,
  photoURL,
  aboutMe,
  fullName,
  jobTitle,
  age,
  email,
  phone,
  address,
  professionalSkill
) {
  const ChatId = chatId.toString();
  const PhotoURL = photoURL.toString();
  const AboutMe = aboutMe.toString();
  const FullNamee = fullName.toString();
  const JobTitle = jobTitle.toString();
  const Age = age.toString();
  const Email = email.toString();
  const Phone = phone.toString();
  const Address = address.toString();

  const proSkills = {
      title: professionalSkill.title.split(','),
      skillLevel: professionalSkill.skillLevel.split(',')
  };

  console.log('professional sk '+ proSkills);

  ResumeDetail.findOne({ chatId: ChatId }).then((result) => {
    if (result) {
      return (state = true);
    } else {
      const details = new ResumeDetail({
        chatId: ChatId,
        photoURL: PhotoURL,
        aboutMe:AboutMe,
        fullName: FullNamee,
        jobTitle: JobTitle,
        age: Age,
        email: Email,
        phone: Phone,
        address: Address,
        professionalSkills: proSkills
      });
      
     // result.professionalSkills.push(proSkills);
      details.save();
      return (state = false);
    }
  });
}

// Function to send a base64 file
function sendBase64File(chatId, base64Data, filename) {
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = Buffer.from(base64Image, 'base64');

    // Save the base64 data to a temporary image file
    const tempImagePath = `./temp/${filename}`;
    fs.writeFileSync(tempImagePath, dataBuffer);
  
  // Send the temporary image file as a photo
  bot.sendPhoto(chatId, tempImagePath)
    .then(() => {
      // Optional: Delete the temporary image file after sending
      fs.unlinkSync(tempImagePath);
    })
    .catch((error) => {
      console.error('Error sending base64 image as a photo:', error);
    });
}

function deleteResume(chatId) {
  const ChatId = chatId.toString();

    ResumeDetail.findOne({chatId:ChatId})
    .then(resume=> {
      resume.deleteOne();
      bot.sendMessage(chatId,'resume deleted successfully');
    })
    .catch(err=> {
      console.log(err);
    })
}

mongoose
  .connect(
    "mongodb+srv://yididiya:mnYxZgzDQhULh2Ow@cluster0.de0jhxk.mongodb.net/resume-DB?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
