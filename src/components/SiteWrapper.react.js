// @flow

import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";

import { Site, Nav, Grid, List, Button } from "tabler-react";

type Props = {|
  +children: React.Node,
|};

type subNavItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +LinkComponent?: React.ElementType,
|};

type navItem = {|
  +value: string,
  +to?: string,
  +icon?: string,
  +active?: boolean,
  +LinkComponent?: React.ElementType,
  +subItems?: Array<subNavItem>,
|};

const navBarItems: Array<navItem> = [
  { value: "Dashboard", to: "/", icon: "home", LinkComponent: withRouter(NavLink) },
  {
    value: "Details",
    icon: "box",
    subItems: [
      {
        value: "Project",
        to: "/projects",
        LinkComponent: withRouter(NavLink),
      },
    ],
  },
  
];


const accountDropdownProps = {
  avatarURL: "https://en.gravatar.com/userimage/37190760/17210d6aefc2c2865103c87afd046242.jpeg",
  name: "Jane Pearson",
  description: "Administrator",
  options: [
    // { icon: "user", value: "Profile" },
    // { icon: "settings", value: "Settings" },
    // { icon: "mail", value: "Inbox", badge: "6" },
    // { icon: "send", value: "Message" },
    // { isDivider: true },
    // { icon: "help-circle", value: "Need help?" },
    { icon: "log-out", value: "Sign out" , to: "/login" },
  ],
};

class SiteWrapper extends React.Component<Props, void> {
  render(): React.Node {
    return (
      <Site.Wrapper
        headerProps={{
          href: "/",
          alt: "Core Cocker",
          imageURL: "assets/hipster.svg",
          navItems: (
            <Nav.Item type="div" className="d-none d-md-flex">
              {/* <Button
                href="https://github.com/tabler/tabler-react"
                target="_blank"
                outline
                size="sm"
                RootComponent="a"
                color="primary"
              >
                Source code
              </Button> */}
            </Nav.Item>
          ),
          accountDropdown: accountDropdownProps,
        }}
        navProps={{ itemsObjects: navBarItems }}
        footerProps={{
          links: [
            <a href="/">dashboard</a>,
            
          ],
          note: "",
          copyright: (
            <React.Fragment>
              Copyright © 2018
              <a href="."> Tabler-react</a>. Theme by
              <a
                href="https://codecalm.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                codecalm.net
              </a>{" "}
              All rights reserved.
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto={true}>
                <List className="list-inline list-inline-dots mb-0">
                  <List.Item className="list-inline-item">
                    <a href="./faq">FAQ</a>
                  </List.Item>
                </List>
              </Grid.Col>
              <Grid.Col auto={true}>
                <Button
                  href="https://github.com/rolfwessels"
                  size="sm"
                  outline
                  color="primary"
                  RootComponent="a"
                >
                  Source code
                </Button>
              </Grid.Col>
            </React.Fragment>
          ),
        }}
      >
        {this.props.children}
      </Site.Wrapper>
    );
  }
}

export default SiteWrapper;
