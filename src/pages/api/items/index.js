import prisma from "@/dataConnection";

export default async function handler(req, res) {

  if (req.method === 'GET') {
    try{
      const items = await prisma.item.findMany();
      if(!items)
      {
        return res.status(405).json({message:'item not found'})
      }
      res.status(200).json(items);
    }
    catch(err){
      res.status(500).json({message:`internal error${err}`})
    }
   
  } else if (req.method === 'POST') {

    try{
    const { name, price, stock } = req.body;
      if(!name || !price || !stock)
      {
      return res.status(405).json({message:'field is missing'})
      }
    const items = await prisma.item.findFirst({where:{name:name}})
     if(items)
     {
      return res.status(409).json({message:'data alreadry exist'})
     }
  
    const newItem = await prisma.item.create({
      data: { name, price: parseFloat(price), stock: parseInt(stock, 10) },
    });
    res.status(201).json(newItem);
    }
    catch(err)
    {
      res.status(500).json({message:`internal error${err}`})
    }

    
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}