import { readFile, writeFile } from 'fs/promises'

const DB_PATH = './database.json'

async function readDB() {
    const data = await readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
}

async function writeDB(data) {
    await writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

export async function getUsers() {
    return await readDB()
}

export async function getUser(id) {
    const users = await readDB()
    return users.find(user => user.id === id)
}

export async function createUser(data) {
    const users = await readDB()
    const newUser = { id: Date.now().toString(), ...data }
    users.push(newUser)
    await writeDB(users)
    return newUser
}

export async function updateUser(id, update) {
    const users = await readDB()
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], ...update }
    await writeDB(users)
    return users[index]
}

export async function deleteUser(id) {
    const users = await readDB()
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    await writeDB(users)
    return true
}