import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const item = await prisma.item.findUnique({ where: { id: parseInt(id, 10) } });
    if (item) res.status(200).json(item);
    else res.status(404).json({ error: 'Item not found' });
  } else if (req.method === 'PUT') {
    const { name, price, stock } = req.body;
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id, 10) },
      data: { name, price: parseFloat(price), stock: parseInt(stock, 10) },
    });
    res.status(200).json(updatedItem);
  } else if (req.method === 'DELETE') {
    await prisma.item.delete({ where: { id: parseInt(id, 10) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}