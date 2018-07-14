// @flow strict

import * as React from 'react';
import SiteWrapper from "../../components/SiteWrapper";
import {
  Page,

} from "tabler-react";

type Props = {||};

class ProjectsPage extends React.Component<Props> {
  render() {
    return (
      <SiteWrapper>
        <Page.Content title="Projects">
        </Page.Content>
      </SiteWrapper>
    );
  }
}

export default ProjectsPage;
