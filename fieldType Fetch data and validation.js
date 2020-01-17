    var fieldsInJsons = [];
    this.state.groups.map((json) => {
        json.fields.map((field) => {
            fieldsInJsons.push(field.fieldName)
            if(field.subField)
            {
              field.subField.map((subField) => {
                fieldsInJsons.push(subField.fieldName)
                if(subField.subField)
                {
                  subField.subField.map((subSubField) => {
                    if(subSubField.fieldType === "text")
                      fieldsInJsons.push(subSubField.fieldName)
                    else
                      fieldsInJsons.push(subField.fieldName)
                  })
                }
              })
            }
          })   
        })

       
    var copyGroups = this.state.groups
    var croppedState = this.state;
    delete croppedState.groups;
    delete croppedState.registrationNumber;

    var keysOfCroppedState = Object.keys(croppedState);

    console.log(keysOfCroppedState, fieldsInJsons)
    var count = 0, tempCount = 0;

    if(keysOfCroppedState.length > 0 )
    {
      for(let i = 0 ; i < fieldsInJsons.length ; i++)
      {
        for(let j = 0 ; j < keysOfCroppedState.length ; j++)
        {
          if(fieldsInJsons[i] === keysOfCroppedState[j])
          {
            if(croppedState[fieldsInJsons[i]] === "Fibre Channel" || croppedState[fieldsInJsons[i]] === "Copper Channel")
            {
              for(let k = 0 ; k < keysOfCroppedState.length ; k++)
              {
                tempCount = tempCount + 1;
              }
            }
            else{
              tempCount = tempCount + 1;
            }
          }
        }  

        if(tempCount === 0)
        { 
          //Finding the equivalent field name in group
          copyGroups.map((group)=>{
            group.fields.map((field)=>{
              if(field.fieldName === fieldsInJsons[i])
               {
                field.mandatory = true;
                this.setState({groups : copyGroups})
               }

                if(field.subField)
                {  
                  field.subField.map((subField) => {
                      if(subField.fieldName === fieldsInJsons[i])
                      {
                        subField.mandatory = true;
                        this.setState({groups : copyGroups})      
                      }
                  })
                }
            })           
          })

          count = count + 1;
        }
        else{
          tempCount = 0;
        }
      }
    }
    else
    {
      count = 1;
    }

    // if(count ===  0)
    // {
    //   fetch('/post/data', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       data: croppedState
    //     }),
    //     headers: { "Content-Type": "application/json" }
    //   })
    //     .then(function (response) {
    //       return response.json()
    //     }).then((body) => {
          
    //     });
    //   }