// @flow

import React from 'react';
import TimeAgo from 'react-timeago';
import { Grid, Card, Text, Table } from 'tabler-react';
import EditDelete from '../../components/EditDelete';
import { Project } from './ProjectTypes';
import ShortId from '../../components/ShortId';

type Props = {
  projects: Project[],
  update(project: Project): void,
  remove(project: Project, callback: any): void
};

export default class ProjectsList extends React.Component<Props> {
  render() {
    const { projects } = this.props;

    return (
      <Grid.Row cards deck>
        <Grid.Col width={12}>
          <Card>
            <Table responsive highlightRowOnHover hasOutline verticalAlign="center" cards className="text-nowrap">
              <Table.Header>
                <Table.Row>
                  <Table.ColHeader className="w-1">Id</Table.ColHeader>
                  <Table.ColHeader>Name</Table.ColHeader>
                  <Table.ColHeader>Updated</Table.ColHeader>
                  <Table.ColHeader alignContent="center" className="w-1" />
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {projects.map(project => (
                  <Table.Row key={project.id}>
                    <Table.Col>
                      <Text.Small muted>
                        <ShortId id={project.id} />
                      </Text.Small>
                    </Table.Col>
                    <Table.Col>{project.name}</Table.Col>
                    <Table.Col>
                      <TimeAgo date={project.updateDate} />
                    </Table.Col>
                    <Table.Col alignContent="center">
                      <EditDelete model={project} update={this.props.update} remove={this.props.remove} />
                    </Table.Col>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>
        </Grid.Col>
      </Grid.Row>
    );
  }
}
