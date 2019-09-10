var mongoose = require('mongoose');

var warehouseSchema= mongoose.Schema({
    //name
    name: {
        type:String,
        required:true
    },
    //address
    address:String,
    //capacity
    capacity:{
        type:Number,
        min:200,
        max:450
    }
});

var warehouseModel=mongoose.model('Warehouse', warehouseSchema);
module.export=warehouseModel;