import React from 'react';
import VirtualizedTable from './VirtualizedTable';

import { Breadcrumb, Panel, IconButton } from 'rsuite';
import SettingIcon from '@rsuite/icons/Setting';

const Page = () => {
  // Sample data for VirtualizedTable (you can replace this with your actual data)
  const Data = [
    {
      id: 2200030939,
      Name: 'Bhanu Prakash',
      gender: 'Male',
      branch: 'CSE-Honors',
      email: '2200030939@kluniversity.in',
      problem: 'Wifi Issue',
    },
    {
      id: 2200033156,
      Name: 'GN Rohit',
      gender: 'Male',
      branch: 'CSE-Honors',
      email: '2200030156@kluniversity.in',
      problem: 'Attendance Issue',
    },
    {
      id: 2200031469,
      Name: 'Adari Dinesh Srisanth',
      gender: 'Male',
      branch: 'CSE-Honors',
      email: '2200031469@kluniversity.in',
      problem: 'Health Issue',
    },
    {
      id: 2200032955,
      Name: 'Manish Raj',
      gender: 'Male',
      branch: 'CSE-Honors',
      email: '2200032955@kluniversity.in',
      problem: 'Broken Seats',
    },
    {
      id: 2200033158,
      Name: 'Shreyas Raj',
      gender: 'Male',
      branch: 'CSE-Honors',
      email: '2200033158@kluniversity.in',
      problem: 'Drinking Water issue',
    },
    {
      id: 2200033180,
      Name: 'Ashish Ranjan',
      gender: 'Male',
      branch: 'CSE-Honors',
      email: '2200033180@kluniversity.in',
      problem: 'Defective Lab Equipment',
    },
  ];

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
