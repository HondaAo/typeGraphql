import { redis } from '../../redis'
import { v4 } from 'uuid'
import { confimationPrefix } from '../../constants/redisPrefix';

export const confirmation = (userId: number) => {
   const token = v4();
   redis.set(confimationPrefix + token, userId, "ex", 60*60*24);
   return `http://localhost:3000/confirm/${token}`;
}