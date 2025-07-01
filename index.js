import http from 'http'
import { router } from './lib/router.js'

const server = http.createServer((req, res) => {
    router(req, res).catch(err => {
        console.error(err)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal Server Error' }))
    })
})

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000')
})