import express, { Request, Response } from 'express'
import { getPlayer, getPlayerUnlocks } from '../controllers/playerController'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Player Index')
});

router.get('/:id', getPlayer)

router.get('/:id/unlocks', getPlayerUnlocks)

export default router
