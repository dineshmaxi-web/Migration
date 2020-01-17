import React from 'react';
import './App.css';

class Type extends React.Component
{
 render()
  {
    
    if(this.props.data.name)
    {
      return( 
          <input type="text" value={this.props.data.name} />
      )
    }
  }
}

export default Type;