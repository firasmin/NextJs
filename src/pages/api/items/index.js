import { PrismaClient} from '@prisma/client';
const prisma =  new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await prisma.item.findMany();
    res.status(200).json(items);
  } else if (req.method === 'POST') {
    const { name, price, stock } = req.body;
    const newItem = await prisma.item.create({
      data: { name, price: parseFloat(price), stock: parseInt(stock, 10) },
    });
    res.status(201).json(newItem);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}