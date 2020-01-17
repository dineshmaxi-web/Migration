var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
    groups : [{
        groupName :  {type : String, required : true},
        fields : {
            name : {type : String, required : true},
            emailAddress : {type : String, required : true},
            phoneNumber : {type : Number, required : true},    
            address : {type : String, required : true},
            city : {type : String, required : true},
            zipCode : {type : String, required : true}
        }
    },{
        groupName :  {type : String, required : true},
        fields : {
            AccountNumber : {type : String, required : true},
            PurposeOfMigration : {type : String, required : true},
            TargetEquipment : {type : Number, required : true},    
            Installed : {type : Number, required : true},
            StartDate : {type : String, required : true},
            CompletionDate : {type : String, required : true},
            WasCode : {type : String, required : true},
            DeliverySpecific : {type : String, required : true},
            MigrationType : {type : String, required : true},
            Description : {type : String, required : true}
        }
    },{
        groupName :  {type : String, required : true},
        fields : {
            FreezeWindow : {type : Number, required : true},
            OutageWindows : {type : String, required : true}
        }
    },{
        groupName :  {type : String, required : true},
        fields : {
            SourceSiteName : {type : String, required : true},
            SourceSiteAddress : {type : String, required : true},
            SourceArray : {type : Number, required : true},    
            NoOfSourceArray : {type : Number, required : true},
            StorageVisualization : {type : Number, required : true},
            DestinationArray : {type : String, required : true},
            MigrationDc : {type : Number, required : true},
            DestinationSiteName : {type : String, required : true},
            DestinationSiteAddress : {type : String, required : true},
            Connection : {type : Number, required : true}
        }
    }
]
});

var data = mongoose.model('datas' , userSchema);

module.exports = data;
