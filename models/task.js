var mongoose = require('mongoose');

var taskSchema= mongoose.Schema({
    taskname: {
        type:String,
        required:true
    },
    assignto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Developer'
    },
    dueDate:Date,
    status:{
        type:String,
        validate: {
            validator: function (statusValue) {
                return statusValue == 'InProgress' || statusValue == 'Complete';
            },
            message: 'Status should be either InProgress or Complete'
        }
    },
    description:String
});

var taskModel=mongoose.model('Task', taskSchema);
module.export=taskModel;