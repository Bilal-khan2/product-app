import express from 'express';
import path from 'path';
import cors from 'cors';
import { timeStamp } from 'console';
import { get } from 'http';

console.log("server file here")
const app = express()
const port = process.env.PORT || 5001

app.use(cors());
app.use(express.json())

let products = [];

 
app.post('/create', (req, res) => {
  const body = req.body;
console.log(req.body);
  if (!body.name || !body.price || !body.details) {

    res.status(400).send(
      {message:"Data Error PARAMETERS are Missing "})
      return;
  }

    console.log(body.name)
    console.log(body.price)
    console.log(body.details)


    products.unshift({
      id: `${new Date().getTime()}`,
      name: body.name,
      price: body.price,
      details: body.details
    });

     res.send({message:'Product added successfully at:- ' }+ new Date().toString())
     console.log(products)
})

app.get('/products', (req, res) => {
  res.send(products)
});

app.get('/product/:id', (req, res) => {
  const id = req.params.id;

  let isFound = false;

  for (let i = 0; i <= products.length; i++) {

    if (products[i].id === id) {
      res.send(products[i])
      isFound = true;
      break;
    }

  }

  if (isFound === false) {
    res.status(404).send(
      {message:"Product not found"})
  }
   
  return;
});

app.delete('/product/:id', (req,res) => {
  let isFound =false;
  const id= req.params.id;
   
  for(let i=0;i<=products.length;i++)
  {
    if(products[i].id === id){
       

     products.splice(i,1);

      res.send({message:"Product Deleted Successfully"})

      isFound = true;
      break;
    }
  }
   if(isFound === false)
   {
    res.status(404).send({message:"Bad request Product not found"})
   }

});

app.put('/product/:id', (req, res) => {

  const body = req.body;
  const id= req.params.id;
  let isFound =false;

  if (body.name && body.price && body.details) {

    console.log(body.name)
    console.log(body.price)
    console.log(body.details)

  for(let i=0;i<=products.length;i++)
  {
    if(products[i].id === id){
    
      products[i].name= body.name
      products[i].price= body.price
      products[i].details= body.details
      
      // products.push({
      //   id: id,
      //   name: body.name,
      //   price: body.price,
      //   details: body.details
      // });

      res.send({message:"Product Modification Successfully"})

      isFound = true;
      break;
    }
  }
   if(isFound === false)
   {
    res.status(404).send({message:"Bad request Product not found"})
   }
   

    res.send('Product added successfully at:- ' + new Date().toString())
  }
  else {
    res.status(400).send({message:"Data Error PARA ARE MISSING"})
  }

})
const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './web/build')))
app.use('*', express.static(path.join(__dirname, './web/build')))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 