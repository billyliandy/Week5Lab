var mongoose = require('mongoose');

var developerSchema= mongoose.Schema({
    devname: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level:{
        type:String,
        required:true,
        validate: {
            validator: function (levelValue) {
                return levelValue == 'Beginner' || levelValue == 'Expert';
            },
            message: 'Level should be either Beginner or Expert'
        }
    },
    address: {
        state: String ,
        suburb: String,
        street: String,
        unit: String
    }
});

var developerModel=mongoose.model('Developer', developerSchema);
module.exports=developerModel;