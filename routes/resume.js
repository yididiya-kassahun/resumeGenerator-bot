const express = require("express");

 const resumeController = require("../controllers/resume");
 const router = express.Router();

router.get('/get.resume/:chatId', resumeController.getResumeURL);

router.get('/resumePDF/:id', resumeController.resumePDF);
router.get('/generate.pdf/:id', resumeController.generatePDF);

module.exports = router;