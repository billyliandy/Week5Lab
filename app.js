let express=require('express');
let mongoose=require('mongoose')
let app = express();
let Warehouse = require('./models/warehouse');
let Item=require('./models/item');

mongoose.connect('mongodb://localhost:27017/warehouse08',function(err){});

    app.get('/addwarehouse/:name/:address/:capacity',(req,res)=>{
        Warehouse.create({
            name:req.params.name,
            address:req.params.address,
            capacity:req.params.capacity
        },function(err){
            console.log(err.toString);
            res.send(err.toString);
        })
    })
app.get('/getallitems',(req,res)=>{
    Item.find().populate('Warehouse').exec((err,data)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(data)
        }
    })
})

app.get('/addItem/:name/:cost/:quantity/:whID',(req,res)=>{
    Item.create({
        name:req.params.name,
        cost:req.params.cost,
        quantity:req.params.quantity,
        warehouse:mongoose.Types.ObjectId(req.params.whID)
    },function(err){
        if(err)console.log(err.toString);
    })
})

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(() =>{
    console.log('listening');
},3500);