// @flow

import React from 'react'
import TimeAgo from 'react-timeago'
import {
  Grid,
  Card,
  Text,
  Table,
} from "tabler-react";
import EditDelete from '../../components/EditDelete';
import { User } from './UserTypes';
import ShortId from '../../components/ShortId';

type Props = {
  users: User[];
  update(user: User) : void;
  remove(user: User, callback: any) : void;
}

export default class UsersList extends React.Component<Props> {

  render() {
    const { users } = this.props;

    return (
      <Grid.Row cards deck>
        <Grid.Col width={12}>
          <Card>
            <Table
              responsive
              highlightRowOnHover
              hasOutline
              verticalAlign="center"
              cards
              className="text-nowrap"
            >
              <Table.Header>
                <Table.Row>
                  <Table.ColHeader className="w-1">Id</Table.ColHeader>
                  <Table.ColHeader>Name</Table.ColHeader>
                  <Table.ColHeader>Email</Table.ColHeader>
                  <Table.ColHeader>Roles</Table.ColHeader>
                  <Table.ColHeader>Updated</Table.ColHeader>
                  <Table.ColHeader alignContent="center" className="w-1">


                  </Table.ColHeader >
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {users.map((user) =>
                  <Table.Row key={user.id}>
                   <Table.Col>
                      <Text.Small muted>
                        <ShortId id={user.id} />
                      </Text.Small>
                    </Table.Col>
                    <Table.Col>
                      {user.name}
                    </Table.Col>
                    <Table.Col>
                      {user.email}
                    </Table.Col>
                    <Table.Col>
                      {user.roles}
                    </Table.Col>
                    <Table.Col>
                      <TimeAgo date={user.updateDate} />
                    </Table.Col>
                    <Table.Col alignContent="center">
                      <EditDelete model={user} update={this.props.update} remove={this.props.remove} />
                    </Table.Col>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Card>
        </Grid.Col>
      </Grid.Row>
    )
  }
}
