const express = require("express");

const resumeController = require("../controllers/resumeController");
const router = express.Router();

router.get('/resume.detail', resumeController.getResumeURL);

module.exports = router;