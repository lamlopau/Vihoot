const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const Quiz = require("../models/quiz")
const Game = require("../models/game")
const Leaderboard = require("../models/leaderboard")

router.post('/', async (req, res) => {
  const { gameId, playerResultList } = req.body

  let game = await Game.findById(gameId)
  let quiz = await Quiz.findById(game.quizId)

  const leaderboard = new Leaderboard({
    gameId,
    playerResultList,
  })

  quiz.questionList.forEach((question) => {
    leaderboard.questionLeaderboard.push({
      questionIndex: question.questionIndex,
      questionResultList: [],
    })
    leaderboard.currentLeaderboard.push({
      questionIndex: question.questionIndex,
      leaderboardList: [],
    })
  })

  try {
    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/:leaderboardId/playerresult', async (req, res) => {
  const { leaderboardId } = req.params
  const { playerResultId } = req.body
  let leaderboard

  try {
    leaderboard = await Leaderboard.findById(leaderboardId)
    leaderboard.playerResultList.push(playerResultId)
    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/:leaderboardId/currentleaderboard', async (req, res) => {
  const { leaderboardId } = req.params
  const { questionIndex, playerId, playerCurrentScore } = req.body
  let leaderboard

  try {
    leaderboard = await Leaderboard.findById(leaderboardId)
    leaderboard.currentLeaderboard[questionIndex - 1].leaderboardList.push({
      playerId,
      playerCurrentScore,
    })

    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
router.patch('/:leaderboardId/questionleaderboard', async (req, res) => {
  const { leaderboardId } = req.params
  const { questionIndex, playerId, playerPoints } = req.body
  let leaderboard

  try {
    leaderboard = await Leaderboard.findById(leaderboardId)
    leaderboard.questionLeaderboard[questionIndex - 1].questionResultList.push({
      playerId,
      playerPoints,
    })

    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})
router.get('/:id', async (req, res) => {
  let leaderboard
  try {
    leaderboard = await Leaderboard.findById(req.params.id)
    if (leaderboard == null) {
      return res.status(404).json({ message: "Leaderboard not found" })
    }
    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
