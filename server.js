let express =require('express');
let app = express();
let db= [];
let bodyParser=require('body-parser');

app.use(express.static("public/img"))
app.use(express.static("views"))
app.use(express.static("css"))


app.use(bodyParser.urlencoded({
    extended:false
}))


app.engine("html",require('ejs').renderFile)
app.set("view engine","html");

app.get("/",(req,res)=>{
    res.render("index.html");
    // res.send("Hello World")
})

app.get("/addNewTask",(req,res)=>{
    res.render("addNewTask.html");
})

app.post('/newTask',(req,res)=>{
    // console.log(req.body);
    db.push(req.body);
    console.log(db);
    res.send("Task Added");
})

app.get("/listTask",(req,res)=>{
    res.render("listTask.html",{
        tasks:db
    })

})

app.listen(3000,()=>{
    console.log('Listening on 3000')
})