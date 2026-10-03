import type { Transaction } from '#shared/types/fintrack'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event) ?? {}

  const invalid = validateTxBody(body)
  if (invalid) return badRequest(event, invalid)

  const { type, amount, category, date, description, wallet } = body

  // No try/catch: an unexpected DB error propagates, Nitro logs the stack
  // server-side and returns a generic 500. The old handler returned
  // `detail: err.message`, which leaked SQL text and connection details.
  const [row] = await dbQuery<Transaction>(
    `INSERT INTO transactions (type, amount, category, date, description, wallet)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${txColumns}`,
    [
      type,
      Number(amount),
      String(category).trim(),
      date,
      String(description ?? '').trim(),
      normalizeWallet(wallet),
    ],
  )

  setResponseStatus(event, 201)
  return row
})
