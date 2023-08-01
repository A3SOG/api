import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import redisClient from '../ArmaRedis'

interface PlayerData {
  [key: string]: any[]
}

interface RawData {
  [key: string]: [string, any]
}

function convertDataFormat(data: RawData): PlayerData {
  let result: PlayerData = {}

  Object.values(data).forEach(([key, value]: [string, any[]]) => {
    result[key] = value
  })

  return result
}

function fetchPlayer(data: PlayerData) {
  let result: { [key: string]: any } = {}

  Object.entries(data).forEach(([key, value]) => {
    switch (key) {
      case "Garage":
      case "Locker":
        result[key] = value.map(([type, classname]: [string, string]) => ({ Type: type, Classname: classname }))
        break

      case "Holster":
        let [active, holsterData] = value
        if (holsterData.length > 0) {
          result[key] = {
            Active: active,
            Value: [{
              Classname: holsterData[0],
              Magazine: holsterData[1],
              HandgunItems: holsterData[2].map((item: string, i: number) => ({ Classname: item || "" })),
              Count: holsterData[3]
            }]
          }
        } else {
          result[key] = { Active: active, Value: { Classname: "", Magazine: "", HandgunItems: [], Count: 0 } }
        }
        break

      case "Position":
        result[key] = { X: value[0], Y: value[1] }
        break

      case "PrimaryWeaponItems":
      case "SecondaryWeaponItems":
      case "HandgunItems":
      case "AssignedItems":
        result[key] = value.map((item: string) => ({ Classname: item }))
        break

      case "UniformWeapons":
      case "UniformItems":
      case "VestWeapons":
      case "VestItems":
      case "BackpackWeapons":
      case "BackpackItems":
        result[key] = value.map(([classname, val]: [string, any]) => ({ Classname: classname, Value: val }))
        break

      case "UniformMagazines":
      case "VestMagazines":
      case "BackpackMagazines":
        result[key] = value.map(([classname, val, count]: [string, any, number]) => ({ Classname: classname, Value: val, Count: count }))
        break

      case "LoadedMagazines":
        result[key] = value.map(([classname, count]: [string, number]) => ({ Classname: classname, Count: count }))
        break

      default:
        result[key] = value
        break
    }
  })

  return result
}

function fetchPlayerUnlocks(data: any[]) {
  let result: any[] = []

  if (data[0]) result.push(data[0])
  if (data[1]) result.push(data[1])
  if (data[2]) result.push(data[2])
  if (data[3]) result.push(data[3])
  if (data[4]) result.push(data[4])
  if (data[5]) result.push(data[5])

  return result
}

const getPlayer = asyncHandler(async (req: Request, res: Response) => {
  let { id } = req.params

  try {
    const cacheResults = await redisClient.get(id)
    if (cacheResults) {
      const rawData = JSON.parse(cacheResults) as RawData
      const data = convertDataFormat(rawData)
      const dataObject = fetchPlayer(data)
      res.json(dataObject)
    } else {
      res.status(404)
      throw new Error(`Cannot find player with ID ${id}`)
    }
  } catch (e) {
    res.status(500)
    if (e instanceof Error) {
      throw new Error(e.message)
    } else {
      throw e
    }
  }
})

const getPlayerUnlocks = asyncHandler(async (req: Request, res: Response) => {
  let { id } = req.params

  try {
    const cacheResults = await redisClient.get(id)
    if (cacheResults) {
      const data = JSON.parse(cacheResults)
      const dataObject = fetchPlayerUnlocks(data)
      res.json(dataObject)
    } else {
      res.status(404)
      throw new Error(`Cannot find player unlocks with ID ${id}`)
    }
  } catch (e) {
    res.status(500)
    if (e instanceof Error) {
      throw new Error(e.message)
    } else {
      throw e
    }
  }
})

const createPlayer = asyncHandler(async (req: Request, res: Response) => {
  let key = req.body.key;

  try {
    const cacheResults = await redisClient.get(key);
    if (cacheResults) {
      const rawData = JSON.parse(cacheResults) as RawData;
      const data = convertDataFormat(rawData);
      const dataObject = fetchPlayer(data);
      res.json(dataObject);
    } else {
      res.status(404).send('Data not found');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
  }
})

export {
  createPlayer,
  getPlayer,
  getPlayerUnlocks
}
