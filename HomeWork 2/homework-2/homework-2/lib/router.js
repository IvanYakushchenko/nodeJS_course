import { readdir, stat } from 'fs/promises'
import path from 'path'
import url from 'url'

const ROUTES_DIR = path.resolve('routes')

export async function router(req, res) {
    const method = req.method
    const { pathname } = new URL(req.url, `http://${req.headers.host}`)
    const segments = pathname.split('/').filter(Boolean)

    const { filePath, params } = await findRouteFile(ROUTES_DIR, segments)
    if (!filePath) {
        res.writeHead(404).end(JSON.stringify({ error: 'Not Found' }))
        return
    }

    const routeModule = await import(`${filePath}?update=${Date.now()}`) // for hot reload
    const handler = routeModule[method]
    if (!handler) {
        res.writeHead(405).end(JSON.stringify({ error: 'Method Not Allowed' }))
        return
    }

    await handler(req, res, params)
}

async function findRouteFile(dir, segments, params = {}) {
    if (!segments.length) {
        const file = path.join(dir, 'route.js')
        return (await exists(file)) ? { filePath: file, params } : {}
    }

    const [current, ...rest] = segments
    const entries = await readdir(dir)

    if (entries.includes(current)) {
        const exact = await findRouteFile(path.join(dir, current), rest, params)
        if (exact.filePath) return exact
    }

    const dynamicFolder = entries.find(e => e.startsWith('[') && e.endsWith(']'))
    if (dynamicFolder) {
        const paramName = dynamicFolder.slice(1, -1)
        params[paramName] = current
        const dynamic = await findRouteFile(path.join(dir, dynamicFolder), rest, params)
        if (dynamic.filePath) return dynamic
    }

    return {}
}

async function exists(file) {
    try {
        await stat(file)
        return true
    } catch {
        return false
    }
}