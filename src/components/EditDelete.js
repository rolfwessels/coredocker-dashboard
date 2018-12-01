// @flow

import React, { Component } from 'react';
import { Icon } from 'tabler-react';
import { WithId } from './DefaultTypes';

type Props = {
  model: WithId,
  update(project: WithId): void,
  remove(project: WithId, callback: any): void
};

type State = {
  markedForRemoval: any
};

export default class EditDelete extends Component<Props, State> {
  state = {
    markedForRemoval: {}
  };

  markedForRemoval(model: any, isMarked: boolean) {
    var update = {};
    update[model.id] = isMarked;
    this.setState({ markedForRemoval: Object.assign(this.state.markedForRemoval, update) });
  }

  render() {
    return (
      <div className="editDelete">
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
            <Icon
              prefix="fe"
              name="trash-2"
              onClick={() => {
                this.props.remove(this.props.model, () => {});
              }}
            />
          </span>
        )}
      </div>
    );
  }
}
