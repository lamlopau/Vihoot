import React, { useEffect, useState, useContext } from "react"
import MyQuiz from "./MyQuiz/MyQuiz"
import { useDispatch, useSelector } from "react-redux"
import { getTeacherQuizes, createQuiz } from "../../actions/quiz"
import styles from "./myQuizes.module.css"
import { useHistory } from "react-router-dom"
import { AuthContext } from '../../contexts/AuthContext'
function MyQuizes() {
	const {
		authState: {
			user: { username, _id }
		},
		logoutUser
	} = useContext(AuthContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const isLanguageEnglish = true
  const [quizData, setQuizData] = useState({
    name: "",
    creatorName: username,
    backgroundImage: "",
    description: "",
    pointsPerQuestion: 1,
    isPublic: true,
    tags: [],
    questionList: [],
  })

  const [isQuizPublic, setIsQuizPublic] = useState(true)

  useEffect(() => {
    dispatch(getTeacherQuizes(_id))
  }, [dispatch])

  const { quizes } = useSelector((state) => state.quiz)

  const handleQuizSubmit = () => {
    dispatch(createQuiz(quizData))
    history.push("myquizes")
  }

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value })
  }

  return (
    <div className={styles["quizes-list"]}>
      <div className={styles["quiz-settings"]}>
        <h2>{isLanguageEnglish ? "Create new quiz" : "Stwórz nowy quiz"}</h2>
        <div className={styles["quiz-form"]}>
          <div className={styles["option-label"]}>
            <label>{isLanguageEnglish ? "Title" : "Nazwa"}</label>
          </div>
          <input
            value={quizData.name}
            type="text"
            name="name"
            onChange={handleQuizChange}
          />
          <div className={styles["option-label"]}>
            <label>Description
            </label>
          </div>
          <input
            value={quizData.description}
            type="text"
            name="description"
            onChange={handleQuizChange}
          />
          <div className={styles["option-buttons"]}>
            <button
              onClick={() => {
                setIsQuizPublic(true)
                setQuizData({ ...quizData, isPublic: true })
              }}
              className={styles["option-button"]}
              style={{
                backgroundColor: isQuizPublic ? "rgb(19, 104, 206)" : "inherit",
                color: isQuizPublic ? "white" : "rgb(110, 110, 110)",
              }}
            >
              {isLanguageEnglish ? "Public" : "Publiczny"}
            </button>
            <button
              onClick={() => {
                setIsQuizPublic(false)
                setQuizData({ ...quizData, isPublic: false })
              }}
              className={styles["option-button"]}
              style={{
                backgroundColor: isQuizPublic ? "inherit" : "rgb(19, 104, 206)",
                color: isQuizPublic ? "rgb(110, 110, 110)" : "white",
              }}
            >
              {isLanguageEnglish ? "Private" : "Prywatny"}
            </button>
          </div>
          <button
            onClick={handleQuizSubmit}
            className={styles["submit-button"]}
          >
            {isLanguageEnglish ? "Create new quiz" : "Stwórz nowy quiz"}
          </button>
        </div>
      </div>
      {quizes.map((quiz) => (
        <MyQuiz key={quiz._id} quiz={quiz} />
      ))}
    </div>
  )
}

export default MyQuizes
