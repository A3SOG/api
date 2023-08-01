import express, { Request, Response } from 'express'
import { getPlayer, getPlayerKey, getPlayerMessages, getPlayerUnlocks } from '../controllers/playerController'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Player Index')
});

router.get('/:id', getPlayer)

router.get('/:key/messages', getPlayerMessages)

router.get('/:id/unlocks', getPlayerUnlocks)

router.post('/', getPlayerKey)

export default router
