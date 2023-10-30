const Resume = require('../models/resumeDetail');

exports.getResumeURL = (req,res)=> {
   const userId = req.params.chatId;
   const myChatId = userId.toString();

    Resume.findOne({chatId:myChatId})
    .then(resumeData=> {
        res.render("resume", {
            resumeData:resumeData
          });
    })
    .catch(err=> {
        console.log(err);
    })
};