const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');

var args = ["_id", "name", "emailAddress","phoneNumber", "country", "state"];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var dbo;

MongoClient.connect(url, (err, db) => {
  dbo = db.db("Migration");
});

app.get("/get/forminfo", (req,res) => {
  dbo.collection("Form_Details").find({}).toArray((err, groups) => {

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
  dbo.collection("FormData").find({}).toArray((err, result) => {
    let finalParticulars = [];
    let tempObject = {};
    let key = [];

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
  dbo.collection("FormData").find(ObjectId(req.params.id)).toArray((err, result) => {
    res.send(result)
  })
});

app.get("/get/formdata", (req,res) => {
  dbo.collection("FormData").find({}).toArray((err, result) => {
    res.send(result)
  })
}); 

app.post("/post/data", (req,res) => {
  dbo.collection("FormData").insertOne(req.body, (err, result) => {

    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'dineshozian@gmail.com',
        pass: 'ozian@111'
      }
    });

    mailOption = {
      from: 'Website support <dineshozian@gmail.com>',
      to: "dineshozian@gmail.com",
      subject: "Regarding Zenfra Submission",
      html: '<p>Hello <b>Zenfra</b>, The submission was successfully made to <b>'+req.body.data.CustomerContactInformation.name+'</b>. Cheers! </p>'
    };

    transporter.sendMail(mailOption, (info, err) => {
      if(info){
      }
    });

    mailOption = {
      from: 'Website support <dineshozian@gmail.com>',
      to: req.body.data.CustomerContactInformation.emailAddress,
      subject: "Regarding Zenfra Submission",
      html: '<p>Hello <b>'+ req.body.data.CustomerContactInformation.name+'</b>, Your submission was successfully made. Cheers! </p>'
    };

   transporter.sendMail(mailOption, (info, err) => {
     if(info){
     }
   });

   res.send(result);
  });
});

app.post("/post/adduser", (req,res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.data.password, salt, (err, hash) => {
      req.body.data.password = hash;
      dbo.collection("Users").insertOne(req.body, (err, result) => {
          if(result)
          {
              res.send(result);     
          }
          else{
            res.send(err);
          }
        });
     });
   });
});

app.get("/get/users", (req,res) => {
  dbo.collection("Users").find({}).toArray((err, result) => {
    let finalParticulars = [];
    let tempObject = {};
    let key = [];

    result.map(res => {
      key = Object.keys(res.data)      
      tempObject._id = res._id;

      key.map(field => {
            tempObject[field] = res.data[field]
      })

      finalParticulars.push(tempObject)
      tempObject = {}
    })
    res.send(finalParticulars)
    finalParticulars = []
  })
}); 

app.post("/update/user", (req,res) => {
  const options = {returnOriginal: false, upsert: true};

  var newvalues = { $set: { data :{ firstName: req.body.data.firstName, lastName: req.body.data.lastName, email: req.body.data.email, password: req.body.data.password, userQuote: req.body.data.userQuote} }};

  dbo.collection("Users").findOneAndUpdate({_id : ObjectId(req.body.data.id)}, newvalues, options).then((err, result) => {
      res.send(result)
  })
})

app.post("/delete/user", (req,res) => {
  const options = {returnOriginal: false};
  dbo.collection("Users").deleteOne({_id : ObjectId(req.body.data)}, options).then((err, result) => {
      res.send(result)
  })
})


var port = process.env.NODE_ENV || 5000
app.listen(port, () => console.log(`Listening on port 5000`));