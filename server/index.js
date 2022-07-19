require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

const connectDB = async () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect('mongodb+srv://lam:123@cluster0.vna3b.mongodb.net/?retryWrites=true&w=majority', connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error.message)
		process.exit(1)
	}
}

connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
