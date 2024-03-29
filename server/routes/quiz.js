const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const Quiz = require("../models/quiz")
var mongoose = require('mongoose');


router.get('/', async (req, res) => {
	try {
        const quizes = await Quiz.find()
        res.status(200).send(quizes)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
})
router.post('/', async (req, res) => {
	const {
        name,
        backgroundImage,
        description,
        creatorName,
        pointsPerQuestion,
        isPublic,
        tags,
        likesCount,
        questionList,
      } = req.body
      const quiz = new Quiz({
        name,
        backgroundImage,
        description,
        creatorId: req.userId,
        creatorName,
        pointsPerQuestion,
        isPublic,
        tags,
        likesCount,
        questionList,
        dateCreated: new Date().toISOString(),
      })
    
      try {
        const newQuiz = await quiz.save()
        res.status(201).json(newQuiz)
      } catch (error) {
        res.status(400).json({ message: error.message })
      }
})
router.get('/public', async (req, res) => {
    const { page } = req.query
    try {
      const LIMIT = 6
      const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page
  
      const total = await Quiz.find({ isPublic: true }).countDocuments({})
      const quizes = await Quiz.find({ isPublic: true })
        .sort({ _id: -1 }) // sort from the newest
        .limit(LIMIT)
        .skip(startIndex) // skip first <startIndex> quizes
      // const quizes = await Quiz.find({ isPublic: true })
      res.status(200).send({
        data: quizes,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})

router.get('/search', async (req, res) => {
    const { searchQuery, tags } = req.query

  try {
    //i -> ignore case, like ii, Ii, II
    const name = new RegExp(searchQuery, "i")

    const quizes = await Quiz.find({
      isPublic: true,
      $or: [{ name }, { tags: { $in: tags.split(",") } }],
    })

    res.status(200).send(quizes)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.get('/teacher/:teacherId', async (req, res) => {
    let teacherId = req.params._id
    try {
      const quizes = await Quiz.find({ creatorId: teacherId })
      res.status(200).send(quizes)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    let quiz
    try {
      quiz = await Quiz.findById(req.params.id)
      if (quiz == null) {
        return res.status(404).json({ message: "Quiz not found" })
      }
      res.status(200).json(quiz)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No quiz with id: ${id}`)
    }
  
    try {
      await Quiz.findByIdAndRemove(id)
      res.json({ message: "Quiz deleted succesfully" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})
router.patch('/:id', async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No quiz with id: ${id}`)
    }
  
    const {
      name,
      backgroundImage,
      description,
      pointsPerQuestion,
      isPublic,
      tags,
      questionList,
    } = req.body
    const quiz = new Quiz({
      _id: id,
      name,
      backgroundImage,
      description,
      pointsPerQuestion,
      numberOfQuestions: questionList.length,
      isPublic,
      tags,
      questionList,
      dateCreated: new Date().toISOString(),
    })
  
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz, { new: true })
      res.json(updatedQuiz)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
})

router.get('/:quizId/questions', async (req, res) => {
    const { quizId } = req.params
    try {
      const quiz = await Quiz.findById(quizId)
      if (quiz == null) {
        return res.status(404).json({ message: "Quiz not found" })
      }
      res.status(200).send(quiz.questionList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})

router.post('/:quizId/questions', async (req, res) => {
    const { quizId } = req.params
    const {
      questionType,
      question,
      pointType,
      answerTime,
      answerList,
      correctAnswersList,
    } = req.body
    let quiz
    try {
      quiz = await Quiz.findById(quizId)
      if (quiz == null) {
        return res.status(404).json({ message: "Quiz not found" })
      }
      quiz.questionList.push({
        questionType,
        question,
        pointType,
        answerTime,
        answerList,
        correctAnswersList,
      })
      quiz.numberOfQuestions += 1
      const updatedQuiz = await quiz.save()
      res.send(updatedQuiz)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
})


router.get('/:quizId/questions/:questionId', async (req, res) => {
    const { quizId, questionId } = req.params
    try {
      const quiz = await Quiz.findById(quizId)
      if (quiz == null) {
        return res.status(404).json({ message: "Quiz not found" })
      }
      const question = quiz.questionList.id(questionId)
      res.json(question)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})
router.patch('/:quizId/questions/:questionId', async (req, res) => {
    const { quizId, questionId } = req.params
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(404).send(`No quiz with id: ${quizId}`)
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(404).send(`No question with id: ${questionId}`)
    }
  
    const {
      questionType,
      question,
      pointType,
      answerTime,
      answerList,
      correctAnswersList,
    } = req.body
    let quiz
  
    try {
      quiz = await Quiz.findById(quizId)
      if (quiz == null) {
        return res.status(404).json({ message: "Quiz not found" })
      }
      let questionIndex = quiz.questionList.findIndex(
        (obj) => obj._id == questionId
      )
      quiz.questionList[questionIndex] = {
        _id: questionId,
        questionType,
        question,
        pointType,
        answerTime,
        answerList,
        correctAnswer,
        correctAnswersList,
      }
      const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, quiz, {
        new: true,
      })
      res.send(updatedQuiz)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
})
router.delete('/:quizId/questions/:questionId', async (req, res) => {
    const { quizId, questionId } = req.params
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(404).send(`No quiz with id: ${quizId}`)
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(404).send(`No question with id: ${questionId}`)
    }
    const quiz = await Quiz.findById(quizId)
  
    try {
      let questionIndex = quiz.questionList.findIndex(
        (obj) => obj._id == questionId
      )
      quiz.questionList.splice(questionIndex, 1)
      quiz.numberOfQuestions -= 1
      await Quiz.findByIdAndUpdate(quizId, quiz, {
        new: true,
      })
      res.json({ message: "Question deleted succesfully" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
})

module.exports = router
