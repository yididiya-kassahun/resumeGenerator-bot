const express = require("express");

 const resumeController = require("../controllers/resume");
 const router = express.Router();

router.get('/get.resume/:chatId', resumeController.getResumeURL);

module.exports = router;