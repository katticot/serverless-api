import { Router } from 'itty-router'

import Posts from './handlers/posts'
import Post from './handlers/post'
import {Balance,Supply,RaffleRoot} from './handlers/web3Info'

const router = Router()

router
  .get('/api/posts', Posts)
  .get('/api/balance/:address', Balance)
  .get('/api/supply', Supply)
  .get('/api/raffle/root', RaffleRoot)
  .get('/api/posts/:id', Post)
  .get('/api/endpoint', () => new Response("endpoint", { status: 200 }))
  .get('*', () => new Response("Not found", { status: 404 }))

export const handleRequest = (request) => router.handle(request)