var mongoose = require('mongoose')
var itemSchema=mongoose.Schema({
    //name
    name:String,
    //cost
    cost:Number,
    warehouse:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Warehouse'
    },
    //quantity
    quantity:{
        type: Number,
        min:0
    },
    //creation date
    created:{
        type:Date,
        default:Date.now
    }
});

var itemModel = mongoose.model('Item',itemSchema);
module.exports = itemModel;

//name
//cost
//quantity
//creation date