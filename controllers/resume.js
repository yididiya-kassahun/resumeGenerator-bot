const Resume = require('../models/resumeDetail');
const puppeteer = require('puppeteer');
const path = require('path');

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

exports.resumePDF =  (req,res) => {
    const userChatId = req.params.id;
    const id = userChatId.toString();
    
    Resume.findOne({chatId:id})
    .then(resume=> {
      
         res.render('resume_pdf',{
            resume:resume
         })
    })
    .catch(err=> {
        console.log(err);
    })
};

exports.generatePDF = async (req,res)=> {

    const chatId = req.params.id;

    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();

try{
    await page.goto(`https://bb0e-196-189-243-16.ngrok-free.app/resumePDF/${chatId}`,{
        waitUntil: 'load',
        networkIdleTimeout: 9000, // Adjust the timeout as needed
      });

    const pdfFileName = `${chatId}.pdf`;

    const pdfPath = path.join(__dirname, '../public/files', pdfFileName);

    // Wait for a specific element to appear on the page before proceeding
   await page.waitForSelector('.progress-bar', { timeout: 0 }); 
   
   const pdfFile = await page.pdf({ path: pdfPath, format: "A4",printBackground:true });

   await browser.close();

   // Save the PDF file to the server
   const fs = require('fs');
   fs.writeFileSync(pdfPath, pdfFile);

   // Send the PDF as a response for download
   res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
   res.setHeader('Content-Type', 'application/pdf');
   res.sendFile(pdfPath);

 } catch (error) {
   console.error(error);
   res.status(500).send('An error occurred while generating the PDF.');
 }

}