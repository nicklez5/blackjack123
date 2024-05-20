import React, { Component } from 'react'
import './styles.css'
export class Card extends Component {
  constructor(props){
    super(props);
    this.state = {
        suit: props.suit,
        number: props.number
    }
  }
  render() {
    return (
      <div class="card">
        
      </div>
    )
  }
}

export default Card
