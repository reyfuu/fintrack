import pg from 'pg'

/**
 * Cache the pool on globalThis. Vercel reuses a warm Lambda across invocations,
 * but module scope can be re-evaluated; without this, cold paths leak pools and
 * Neon's connection limit is reached under modest traffic.
 */
const store = globalThis as unknown as { __fintrackPool?: pg.Pool }

export function useDb(): pg.Pool {
  if (store.__fintrackPool) return store.__fintrackPool

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL is not configured' })
  }

  store.__fintrackPool = new pg.Pool({
    connectionString,
    // Neon requires TLS. Being explicit avoids depending on how this version of
    // pg interprets sslmode= from the connection string.
    ssl: { rejectUnauthorized: true },
    // One request per invocation, and Neon's -pooler endpoint (PgBouncer) does
    // the real pooling — a bigger pool here only multiplies idle connections
    // across concurrent Lambdas.
    max: 1,
    idleTimeoutMillis: 10_000,
    // Neon scale-to-zero compute can take seconds to wake, and pg's default of 0
    // means "wait forever".
    connectionTimeoutMillis: 15_000,
    allowExitOnIdle: true,
    statement_timeout: 10_000,
  })

  store.__fintrackPool.on('error', err => console.error('[db] idle client error', err))

  return store.__fintrackPool
}

/**
 * Auto-imported into every Nitro handler. Named dbQuery, not query, because
 * every named export in server/utils becomes a server-wide global.
 */
export async function dbQuery<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await useDb().query(text, params)
  return result.rows as T[]
}
