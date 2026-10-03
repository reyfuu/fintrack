export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) return badRequest(event, 'ID tidak valid.')

  const [row] = await dbQuery<{ id: number }>(
    'DELETE FROM transactions WHERE id = $1 RETURNING id::int AS id',
    [id],
  )

  if (!row) return notFound(event)
  return { message: 'Transaksi berhasil dihapus.', id: row.id }
})
