import React, { Component } from 'react'
import {
  Icon,
} from "tabler-react";


export default class EditDelete extends Component {

  constructor() {
    super();
    this.state = {
      markedForRemoval: {},
    };
  }

  markedForRemoval(model, isMarked: bool) {
    var update = {}
    update[model.id] = isMarked;
    console.log('update', update);
    this.setState({ markedForRemoval: Object.assign(this.state.markedForRemoval, update) });
    console.log('this.state', this.state.markedForRemoval);
  }

  render() {
    return (
      <div className="editDelete" >
        {this.state.markedForRemoval[this.props.model.id] || (
          <span>
            <Icon prefix="fe" name="edit-2" onClick={() => this.props.update(this.props.model)} />
            {this.props.remove && (
              <span>
                <Icon prefix="fe" name="trash" onClick={() => this.markedForRemoval(this.props.model, true)} />
              </span>
            )}
          </span>
        )}

        {this.state.markedForRemoval[this.props.model.id] && (
          <span>
            <Icon prefix="fe" name="x" onClick={() => this.markedForRemoval(this.props.model, false)} />
            <Icon prefix="fe" name="trash-2" onClick={() => { this.props.remove(this.props.model, () => this.markedForRemoval(this.props.model, false)); }} />
          </span>
        )}
      </div>
    )
  }
}
