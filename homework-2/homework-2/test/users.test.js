import test from 'node:test'
import assert from 'node:assert'
import http from 'http'

const baseUrl = 'http://localhost:3000'

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const body = data ? JSON.stringify(data) : null
        const req = http.request(
            `${baseUrl}${path}`,
            {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
                }
            },
            res => {
                let resData = ''
                res.on('data', chunk => (resData += chunk))
                res.on('end', () => {
                    try {
                        const json = JSON.parse(resData || '{}')
                        resolve({ status: res.statusCode, json })
                    } catch {
                        resolve({ status: res.statusCode, json: null })
                    }
                })
            }
        )

        req.on('error', reject)
        if (body) req.write(body)
        req.end()
    })
}

let createdUserId = null

test('POST /users → should create a new user', async () => {
    const { status, json } = await request('POST', '/users', {
        name: 'Test User',
        email: 'test@example.com'
    })

    assert.strictEqual(status, 201)
    assert.ok(json.id)
    createdUserId = json.id
})

test('GET /users → should return all users', async () => {
    const { status, json } = await request('GET', '/users')
    assert.strictEqual(status, 200)
    assert.ok(Array.isArray(json))
})

test('GET /users/:id → should return a user by ID', async () => {
    const { status, json } = await request('GET', `/users/${createdUserId}`)
    assert.strictEqual(status, 200)
    assert.strictEqual(json.name, 'Test User')
})

test('PUT /users/:id → should update a user by ID', async () => {
    const { status, json } = await request('PUT', `/users/${createdUserId}`, {
        name: 'Updated User'
    })
    assert.strictEqual(status, 200)
    assert.strictEqual(json.name, 'Updated User')
})

test('DELETE /users/:id → should delete a user by ID', async () => {
    const { status } = await request('DELETE', `/users/${createdUserId}`)
    assert.strictEqual(status, 204)
})