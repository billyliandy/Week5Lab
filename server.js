let express =require('express');
let app = express();
let mongoose=require('mongoose')
let bodyParser=require('body-parser');
// let viewPath= (__dirname+"/views/");

var ObjectId = require('mongodb').ObjectID
let Task = require('./models/task');
let Developer=require('./models/developer');
// let mongoDb=require('mongodb');
// const MongoClient=mongoDb.MongoClient;

//Set Up Mongoose
const url = "mongodb://localhost:27017/week7lab";               
mongoose.connect(url , function(err,client){
    if (err){
        console.log('Error',err)
    }
    else{
        console.log("Server connected")
        app.get('/adddeveloper/:fname/:lname/:level/:state/:suburb/:street/:unit',(req,res)=>{
            let developer= new Developer({
                devname:{
                    firstName:req.params.fname,
                    lastName: req.params.lname,
                },
                level:req.params.level,
                address:{
                    state: req.params.state,
                    suburb: req.params.suburb,
                    street: req.params.street,
                    unit: req.params.unit
                }
            })
            developer.save(function (err) {
                if (err){
                    console.log(err)
                }
                else{
                    console.log('Developer successfully Added to DB');
                    // let task = new Task({
                    //     taskname: "Study",
                    //     assignto: developer._id,
                    //     dueDate: Date.now,
                    //     status: 'InProgress',
                    //     description:'library study session'
                    // });
                    // task.save(function(err){
                    //     if (err) {
                    //         console.log("Error",err)
                    //     }
                    //     else{
                    //         console.log("Task Saved !")
                    //     }
                    // }); 
                }
                res.redirect('/getdeveloper')
        });
    });
    }
    

// MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
//     if(!err){
//         console.log('MongoDB Connected Successfully');
//         db=client.db('fit2095')
//     }else{
//         console.log('Mongo Connection Error',err);
//     }
// })


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

app.get("/getdeveloper",(req,res)=>{
    Developer.find({}).populate('developer').exec((err,data)=>{
            res.render('listdeveloper',{
                developerDB:data
        })
    })
})

app.get("/addNewTask",(req,res)=>{
    res.render("addNewTask.html");
})

//ADD TASKS
app.post('/newTask',(req,res)=>{
    let taskDetails=req.body;
    let taskdeveloper = taskDetails.assignto;
    console.log(taskDetails);
     
    Task.create({
        taskname: taskDetails.name,
        assignto: new mongoose.Types.ObjectId(taskdeveloper),
        dueDate: taskDetails.dueDate,
        status: taskDetails.taskstatus,
        description:taskDetails.description
    }, function(err){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/listTask')
        }
    });
    
    }); 

app.get("/listTask",(req,res)=>{
    console.log(Developer);
    Task.find({}).exec(function (err,data){
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
    Task.find().populate('task').updateOne(filter, theUpdate);
    res.redirect('/listTask');// redirect the client to list users page
})
//extra task
app.get('/update-sort', function (req,res){
    Task.where({'status':'Complete'}).limit(3).sort('taskname').exec(function(err,docs){
        console.log(docs);
    })
})

//Delete Task: 
//GET request: send the page to the client to enter the user's name
app.get('/deletetask', function (req, res) {
    res.render('deletetask.html');
});
//POST request: receive the user's name and do the delete operation 
app.post('/deletetaskdata', function (req, res) {
    let taskDetails=req.body;
    let taskId=new mongoose.Types.ObjectId(taskDetails.id)
    
    Task.deleteOne({ _id: taskId }, function (err, doc) {
        console.log(doc);
    }); 
    res.redirect('/listTask');// redirect the client to list users page
});

app.post('/deletecompleted', function (req, res) {
    let taskDetails=req.body;
    let taskId=new mongoose.Types.ObjectId(taskDetails.id)
    Task.deleteOne({ _id: taskId }, function (err, doc) {
        console.log(doc);
    }); 
    res.redirect('/listTask');// redirect the client to list users page
    Task.deleteMany({ status : 'Complete' }, function (err, doc) {
        console.log(doc);
    }); 
    res.redirect('/listTask');// redirect the client to list users page
});

app.post('/deleteOldComplete', function (req, res) {
    let filter = {
        status: "Complete",
        dueDate:{$lt:"2019-09-03"}
    }
    Task.find().populate('task').deleteMany(filter)
    res.redirect('/listTask');// redirect the client to list users psage
});

});

app.listen(3000,()=>{
    console.log('Listening on 3000')
})