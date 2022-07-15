// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://global-infinite-jackal-30724.upstash.io',
  token: 'AXgEASQgZWExMDg3NmMtZTZmMS00NDI0LTlmNTktNTc1MzQ1Y2ViNWFjOGNlMmI2YmNhYWUwNDU3NDg1NzRjMWUyMDA0OGViNGU=',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, roomName, visitorId } = req.body;
  switch (type) {
    case 'add_room_item': {
      try {
        await redis.sadd(roomName, visitorId)
    
        return res.status(200).json({
          error_code: '0',
          msg: `add ${visitorId} to ${roomName} successfully`,
        })
      } catch (err: any) {  
        return res.json({
          error_code: '1',
          msg: err.message
        })
      }
    }
    case 'get_room_items': {
      try {        
        console.log('22,', roomName)
        let data = await redis.smembers(roomName)
    
        return res.status(200).json({
          error_code: '0',
          msg: `get members of ${roomName} is successfully`,
          data,
        })
      } catch (err: any) {  
        return res.json({
          error_code: '1',
          msg: err.message
        })
      }
    }
    case 'get_fields_len': {
      try {
        let data = await redis.scard(roomName)
    
        return res.status(200).json({
          error_code: '0',
          msg: `get number of fields is successfully`,
          data,
        })
      } catch (err: any) {  
        return res.json({
          error_code: '1',
          msg: err.message
        })
      }
    }
    case 'room_item_exist': {
      try {
        let data = await redis.sismember(roomName, visitorId)
        if (data === 0) {
          return res.status(200).json({
            error_code: '0000',
            msg: `${visitorId} is not member of ${roomName}`
          })
        } else {
          return res.status(200).json({
            error_code: '0001',
            msg: `${visitorId} is member of ${roomName}`
          })
        }
      } catch (err: any) {  
        return res.json({
          error_code: '1',
          msg: err.message
        })
      }
    }
    case 'remove_room_item': {
      try {
        console.log('33,', visitorId)
        let data = await redis.srem(roomName, visitorId)
        if (data === 1) {
          return res.status(200).json({
            error_code: '0000',
            msg: `remove ${visitorId} of ${roomName} is successfully`
          })
        } else {
          return res.status(200).json({
            error_code: '0001',
            msg: `${visitorId} is not exist in ${roomName}`
          })
        }
      } catch (err: any) {  
        return res.json({
          error_code: '1',
          msg: err.message
        })
      }
    }
    case 'remove_room': {
      try {
        let data = await redis.del(roomName)
        if (data) {
          return res.status(200).json({
            error_code: '0000',
            msg: `remove ${roomName} is successfully`
          })
        }
      } catch (err: any) {  
        return res.json({
          error_code: '1',
          msg: err.message
        })
      }
    }
    
  }

}


/***** 
 * roomName
 * [
 *  visitorId1,
 *  visitorId2,
 * ]
 */

