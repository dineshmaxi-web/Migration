const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

var args = ["_id", "name", "emailAddress","phoneNumber", "country", "state", "zipCode"];
var finalParticulars = [];
var groupKeys = ["CustomerContactInformation","OpportunityInformation","ManagementInformation","SiteDetails","ServersinMigrationScope"]
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var dbo;

MongoClient.connect(url, function(err, db) {
  dbo = db.db("Migration");
});

app.get("/get/forminfo", (req,res) => {
  dbo.collection("Form_Details").find({}).toArray(function(err, groups) {

    var activeResult = []
    var tempGroupName = "";
    var tempGroupLabel = "";
    var temptoggleActive;
    var isActive;
    var tempField = [];
    groups.map((group) => {

      //start

        if (group.isActive) {
            tempGroupLabel = group.groupLabel;
            tempGroupName = group.groupName;
            temptoggleActive= group.toggleActive;
            isActive = group.isActive;
        }

        group.fields.map((field) => {
            if (field.isActive) {
                tempField.push({subField: field.subField, placeholder: field.placeholder, fieldName: field.fieldName, fieldType: field.fieldType, fieldLabel: field.fieldLabel, mandatory : field.mandatory, showRequired : field.showRequired })
            }
        })

        activeResult.push({groupName: tempGroupName, isActive: isActive, groupLabel: tempGroupLabel, toggleActive : temptoggleActive, fields: tempField })

        tempGroupName = ""
        tempField = []
       })

      //end

    res.send(activeResult)
  })
});

app.get("/get/formdata/args", (req,res) => {
  dbo.collection("FormData").find({}).toArray(function(err, result) {
  
    var tempObject = {};
    var key = [];

    result.map(res => {
      key = Object.keys(res.data)      
      tempObject._id = res._id;

      args.map(arg => {
        key.map(groupName => {
          if(res.data[groupName].hasOwnProperty(arg))
          {
            tempObject[arg] = res.data[groupName][arg]
          }
        })
      })

      finalParticulars.push(tempObject)
      tempObject = {}
    })
    
    res.send(finalParticulars)
    finalParticulars = []
  })
}) 

app.get("/get/formdata/particular/:id", (req,res) => {

  dbo.collection("FormData").find(ObjectId(req.params.id)).toArray(function(err, result) {
    res.send(result)
  })
});

app.get("/get/formdata", (req,res) => {
  dbo.collection("FormData").find({}).toArray(function(err, result) {
    res.send(result)
  })
}); 

app.post("/post/data", (req,res) => {
  dbo.collection("FormData").insertOne(req.body, function(err, result) {
      res.send(result);
  });
});

var port = process.env.NODE_ENV || 5000
app.listen(port, () => console.log(`Listening on port 5000`));