let express =require('express');
let app = express();
let bodyParser=require('body-parser');
// let viewPath= (__dirname+"/views/");
var ObjectId = require('mongodb').ObjectID

//set up MONGO DB
let mongoDb=require('mongodb');
const MongoClient=mongoDb.MongoClient;
const url = "mongodb://localhost:27017";               
let db= null;
let col =null;

MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if(!err){
        console.log('MongoDB Connected Successfully');
        db=client.db('fit2095')
        // col2=db.createCollection("Tasks");
        // coll =db.collection("Tasks");
    }else{
        console.log('Mongo Connection Error',err);
    }
})


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
    // console.log("Homepage request")
    // col.find({}).toArray(function(err,Week6Lab){
    //     console.log("Find query", Week6Lab)
    // })
    res.render("addNewTask.html");
})

//ADD TASKS
app.post('/newTask',(req,res)=>{
    let taskDetails=req.body;
    console.log(taskDetails); 
    db.collection('tasks').insertOne({
        name: taskDetails.name,
        dueDate: taskDetails.dueDate, 
        description:taskDetails.description,
        assignto:taskDetails.assignto,
        status:taskDetails.taskstatus
    });
    // coll.find({}).toArray(function(err,dbTasks){
    //     console.log("Tasks in DB",dbTasks);
    res.redirect('/listTask');
    })


app.get("/listTask",(req,res)=>{
    db.collection('tasks').find({}).toArray(function (err,data){
        res.render('listTask.html',{
            tasksDb:data
        })
    })

})

//Update tasks: 
//GET request: send the page to the client 
app.get('/updatetask', function (req, res) {
    res.render('updatetask.html');
});
//POST request: receive the details from the client and do the update
app.post('/updatetaskdata', function (req, res) {
    let taskDetails = req.body;
    console.log(taskDetails);
    
    let filter = { _id: ObjectId(taskDetails.id) };
    let theUpdate = { $set: { 
        status:taskDetails.taskstatusnew
    } };
    db.collection('tasks').updateOne(filter, theUpdate);
    res.redirect('/listTask');// redirect the client to list users page
})

//Delete Task: 
//GET request: send the page to the client to enter the user's name
app.get('/deletetask', function (req, res) {
    res.render('deletetask.html');
});
//POST request: receive the user's name and do the delete operation 
app.post('/deletetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = { id: taskDetails._id };
    db.collection('tasks').deleteOne(filter);
    res.redirect('/listTask');// redirect the client to list users page
});

app.post('/deletecompleted', function (req, res) {
    // let taskDetails = req.body;
    // let filter = { status: taskDetails.status };
    db.collection('tasks').deleteMany({status: "completed"}, function (err, obj){
        
    });
    res.redirect('/listTask');// redirect the client to list users page
});

app.post('/deleteOldComplete', function (req, res) {
    let filter = {
        status: "completed",
        dueDate:{$lt:"2019-09-03"}
    }
    db.collection('tasks').deleteMany(filter)
    res.redirect('/listTask');// redirect the client to list users psage
});

app.listen(3000,()=>{
    console.log('Listening on 3000')
})