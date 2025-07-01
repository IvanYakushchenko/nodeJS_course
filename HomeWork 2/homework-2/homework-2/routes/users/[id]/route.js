import {
    getUser,
    updateUser,
    deleteUser
} from '../../../services/users.service.js'

export async function GET(req, res, params) {
    const user = await getUser(params.id)
    if (!user) {
        res.writeHead(404).end(JSON.stringify({ error: 'User not found' }))
        return
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(user))
}

export async function PUT(req, res, params) {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', async () => {
        try {
            const data = JSON.parse(body)
            const updated = await updateUser(params.id, data)
            if (!updated) {
                res.writeHead(404).end(JSON.stringify({ error: 'User not found' }))
                return
            }
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(updated))
        } catch {
            res.writeHead(400).end(JSON.stringify({ error: 'Invalid JSON' }))
        }
    })
}

export async function DELETE(req, res, params) {
    const deleted = await deleteUser(params.id)
    if (!deleted) {
        res.writeHead(404).end(JSON.stringify({ error: 'User not found' }))
        return
    }
    res.writeHead(204).end()
}