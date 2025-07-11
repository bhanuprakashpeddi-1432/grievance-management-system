import React from 'react';
import { Icon } from '@rsuite/icons';
import { VscTable } from 'react-icons/vsc';
import { MdDashboard, MdModeEditOutline } from 'react-icons/md';

export const appNavs = [
  {
    eventKey: 'dashboard',
    icon: <Icon as={MdDashboard} />,
    title: 'Dashboard',
    to: '/dashboard'
  },
  {
    eventKey: 'tables',
    icon: <Icon as={VscTable} />,
    title: 'Grievance List',
    to: '/table-virtualized'
  },
  {
    eventKey: 'forms',
    icon: <Icon as={MdModeEditOutline} />,
    title: 'Create Grievance',
    to: '/form-basic'
  },
];
