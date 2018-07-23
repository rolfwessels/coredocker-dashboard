import React from 'react'
import TimeAgo from 'react-timeago'
import {
  Grid,
  Card,
  Text,
  Table,
  Icon,
} from "tabler-react";
import EditDelete from '../../components/EditDelete';

type Props = {||};

export default class ProjectsList extends React.Component<Props> {

  constructor() {
    super();
    this.state = {
      data: [],
    };

  }

  activateLasers(params) {
    console.log('params', params);
  }

  render() {
    const { data } = this.props;

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
                  <Table.ColHeader>Name</Table.ColHeader>
                  <Table.ColHeader>Updated</Table.ColHeader>
                  <Table.ColHeader>Id</Table.ColHeader>
                  <Table.ColHeader alignContent="center" className="w-1">
                    <Icon prefix="fe" name="settings" />
                  </Table.ColHeader >
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {data.map((project) =>
                  <Table.Row key={project.id}>
                    <Table.Col>
                      {project.name}
                    </Table.Col>
                    <Table.Col>
                      <TimeAgo date={project.updateDate} />
                    </Table.Col>
                    <Table.Col>
                      <Text.Small muted>
                        {project.id}
                      </Text.Small>
                    </Table.Col>
                    <Table.Col alignContent="center">
                      <EditDelete model={project} update={this.props.update} remove={this.props.remove} />

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
