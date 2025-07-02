import React from 'react';
import VirtualizedTable from './VirtualizedTable';
import { getAllGrievances } from '../../../data/grievances';

import { Breadcrumb, Panel, IconButton } from 'rsuite';
import SettingIcon from '@rsuite/icons/Setting';

const Page = () => {
  // Get all grievances from shared data
  const Data = getAllGrievances();

  return (
    <Panel
      header={
        <>
          <h3 className="title">Grievance List</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Grievance List</Breadcrumb.Item>
            <IconButton
              icon={<SettingIcon style={{ fontSize: 10 }} />}/>
          </Breadcrumb>
        </>
      }
    >
      <VirtualizedTable sampledata={Data} /> {/* Pass filtered data to VirtualizedTable */}
    </Panel>
  );
};

export default Page;
