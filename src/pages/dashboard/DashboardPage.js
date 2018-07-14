// @flow

import * as React from "react";

import {
  Page,
  Avatar,
  Icon,
  Grid,
  Card,
  Text,
  Table,
  Progress,
  Dropdown,
  StampCard,
} from "tabler-react";

import SiteWrapper from "../../components/SiteWrapper";

function DashboardPage() {
  return (
    <SiteWrapper>
      <Page.Content title="Dashboard">
        <Grid.Row cards={true}>
          <Grid.Col sm={6} lg={3}>
            <StampCard
              color="blue"
              icon="dollar-sign"
              header={
                <a>
                  132 <small>Sales</small>
                </a>
              }
              footer={"12 waiting payments"}
            />
          </Grid.Col>
          <Grid.Col sm={6} lg={3}>
            <StampCard
              color="green"
              icon="shopping-cart"
              header={
                <a>
                  78 <small>Orders</small>
                </a>
              }
              footer={"32 shipped"}
            />
          </Grid.Col>
          <Grid.Col sm={6} lg={3}>
            <StampCard
              color="red"
              icon="users"
              header={
                <a>
                  1,352 <small>Members</small>
                </a>
              }
              footer={"163 registered today"}
            />
          </Grid.Col>
          <Grid.Col sm={6} lg={3}>
            <StampCard
              color="yellow"
              icon="message-square"
              header={
                <a>
                  132 <small>Comments</small>
                </a>
              }
              footer={"16 waiting"}
            />
          </Grid.Col>
        </Grid.Row>
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
                    <Table.ColHeader alignContent="center" className="w-1">
                      <i className="icon-people" />
                    </Table.ColHeader>
                    <Table.ColHeader>User</Table.ColHeader>
                    <Table.ColHeader>Usage</Table.ColHeader>
                    <Table.ColHeader alignContent="center">
                      Payment
                    </Table.ColHeader>
                    <Table.ColHeader>Activity</Table.ColHeader>
                    <Table.ColHeader alignContent="center">
                      Satisfaction
                    </Table.ColHeader>
                    <Table.ColHeader alignContent="center">
                      <i className="icon-settings" />
                    </Table.ColHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Col alignContent="center">
                      <Avatar
                        imageURL="demo/faces/female/26.jpg"
                        className="d-block"
                        status="green"
                      />
                    </Table.Col>
                    <Table.Col>
                      <div>Elizabeth Martin</div>
                      <Text size="sm" muted>
                        Registered: Mar 19, 2018
                      </Text>
                    </Table.Col>
                    <Table.Col>
                      <div className="clearfix">
                        <div className="float-left">
                          <strong>42%</strong>
                        </div>
                        <div className="float-right">
                          <Text.Small muted>
                            Jun 11, 2015 - Jul 10, 2015
                          </Text.Small>
                        </div>
                      </div>
                      <Progress size="xs">
                        <Progress.Bar color="yellow" width={42} />
                      </Progress>
                    </Table.Col>
                    <Table.Col alignContent="center">
                      <Icon payment name="visa" />
                    </Table.Col>
                    <Table.Col>
                      <Text size="sm" muted>
                        Last login
                      </Text>
                      <div>4 minutes ago</div>
                    </Table.Col>
                    <Table.Col alignContent="center">42%</Table.Col>
                    <Table.Col alignContent="center">
                      <Dropdown>
                        <Dropdown.Trigger icon="more-vertical" toggle={false} />
                        <Dropdown.Menu position="right">
                          <Dropdown.Item icon="tag">Action </Dropdown.Item>
                          <Dropdown.Item icon="edit-2">
                            Another action{" "}
                          </Dropdown.Item>
                          <Dropdown.Item icon="message-square">
                            Something else here
                          </Dropdown.Item>
                          <Dropdown.ItemDivider />
                          <Dropdown.Item icon="link">
                            {" "}
                            Separated link
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Table.Col>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  );
}

export default DashboardPage;
