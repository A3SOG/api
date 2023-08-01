import 'dotenv/config'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import playerRoutes from './routes/player'

const app = express()

const FRONTEND = process.env.FRONTEND

var corsOptions = {
  origin: FRONTEND,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use('/player', playerRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the ArmaRedis API')
})

const PORT: string | number = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`ArmaRedis App listening on port ${PORT}`)
})
