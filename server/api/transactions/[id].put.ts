import type { Transaction } from '#shared/types/fintrack'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) return badRequest(event, 'ID tidak valid.')

  const body = await readBody<Record<string, unknown>>(event) ?? {}

  // Express only checked for presence here; POST additionally validated type,
  // amount and date format. Both now share validateTxBody.
  const invalid = validateTxBody(body)
  if (invalid) return badRequest(event, invalid)

  const { type, amount, category, date, description, wallet } = body

  const [row] = await dbQuery<Transaction>(
    `UPDATE transactions
     SET type = $1, amount = $2, category = $3, date = $4, description = $5, wallet = $6
     WHERE id = $7
     RETURNING ${txColumns}`,
    [
      type,
      Number(amount),
      String(category).trim(),
      date,
      String(description ?? '').trim(),
      normalizeWallet(wallet),
      id,
    ],
  )

  if (!row) return notFound(event)
  return row
})
