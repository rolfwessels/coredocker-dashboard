// @flow
import React from 'react'
import {
  Icon
} from "tabler-react";

type Props = {
  id: string,
};



export default class ShortId extends React.Component<Props> {
  shorten(value: string, count: number) : string {
    let start = value.length - count
    if (start <=0) return value;
    return value.substr(start,count);
  }
  render() {
    return (
      <span title={this.props.id}>
        <Icon prefix="fe" name="hash"/>{this.shorten(this.props.id,4)}
      </span>
    )
  }
}
