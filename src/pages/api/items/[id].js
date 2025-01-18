import prisma from "@/dataConnection";
export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
try{
    const item = await prisma.item.findUnique({ where: { id: parseInt(id, 10) } });
    if (item) res.status(200).json(item);
    else res.status(404).json({ error: 'Item not found' });
   }
catch(err)
     {
      res.status(500).json({message:`internal error ${err}`})
     }
    
  }
 else if (req.method === 'PUT') {
  try{
    
     const { name, price, stock } = req.body;
     if(!name || !price || !stock)
      {
        return res.status(405).json({message:'please fill the require detail'})
      }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id, 10) },
      data: { name, price: parseFloat(price), stock: parseInt(stock, 10) },
    });
    res.status(200).json(updatedItem);
  }
 catch(err){
   res.status(500).json({message:`internal error ${err}`})
 } 
  } 
 else if (req.method === 'DELETE') {
   try{
    const item = await prisma.item.findUnique({ where: { id: parseInt(id, 10) }})
    if(!item)
    {
     return res.status(404).json({message:'data not found'})
    }
    await prisma.item.delete({ where: { id: parseInt(id, 10) } });
    res.status(204).end();
   }
   catch(err)
   {
    res.status(500).json({message:`internal error ${err} `})
   }
    
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}