import { getUsers, createUser } from '../../services/users.service.js'

export async function GET(req, res) {
    const users = await getUsers()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users))
}

export async function POST(req, res) {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', async () => {
        try {
            const data = JSON.parse(body)
            if (!data.name) {
                res.writeHead(400).end(JSON.stringify({ error: 'Name is required' }))
                return
            }
            const user = await createUser(data)
            res.writeHead(201, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(user))
        } catch {
            res.writeHead(400).end(JSON.stringify({ error: 'Invalid JSON' }))
        }
    })
}