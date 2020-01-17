import React from 'react';

class TextInput extends React.Component
{
    render(){
        var fieldType = this.props.field.fieldType;
        var fieldName = this.props.field.fieldName;
        var fieldLabel = this.props.field.fieldLabel;
        return(
            <div id={fieldName + '_field'} name={fieldName + '_field'}>
                <p id={fieldName + '_label'} name={fieldName + '_label'}>{fieldLabel}</p>
                <input id={fieldName} type={fieldType} name={fieldName} onChange={this.onChangeHandler}></input>
            </div>
        )
    }
}

export default TextInput;