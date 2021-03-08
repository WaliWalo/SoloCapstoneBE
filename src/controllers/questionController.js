const QuestionModel = require("../models/QuestionModel");

const getQuestions = async (req, res, next) => {
  try {
    console.log("GET QUESTIONS");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getQuestions };
