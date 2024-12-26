import React from 'react';
import { Icon } from '@rsuite/icons';
import { VscTable } from 'react-icons/vsc';
import { MdFingerprint, MdDashboard, MdModeEditOutline } from 'react-icons/md';
import CubesIcon from '@rsuite/icons/legacy/Cubes';

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
    title: 'Greviance List',
    to: '/table-members',
    children: [
      {
        eventKey: 'virtualized',
        title: 'My List',
        to: '/table-virtualized'
      }
    ]
  },
  {
    eventKey: 'forms',
    icon: <Icon as={MdModeEditOutline} />,
    title: 'Create Grieviance',
    to: '/form-basic',
    children: [
      {
        eventKey: 'form-basic',
        title: 'New Grieviance',
        to: '/form-basic'
      },
    ]
  },
  {
    eventKey: 'authentication',
    title: 'Authentication',
    icon: <Icon as={MdFingerprint} />,
    children: [
      {
        eventKey: 'sign-in',
        title: 'Sign In',
        to: '/sign-in'
      },

      {
        eventKey: 'sign-up',
        title: 'Sign Up',
        to: '/sign-up'
      },
      {
        eventKey: 'error403',
        title: 'Error 403',
        to: '/error-403'
      },
    ]
  },

  {
    eventKey: 'components',
    title: 'Components',
    icon: <CubesIcon />,
    target: '_blank'
  }
];
