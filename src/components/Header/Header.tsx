import React, { useRef } from 'react';
import {
  Dropdown,
  Popover,
  Whisper,
  WhisperInstance,
  Stack,
  Avatar,
  IconButton,
  Navbar,
  Button,
} from 'rsuite';
import { useNavigate, useLocation } from 'react-router-dom';

import GearIcon from '@rsuite/icons/Gear';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import Brand from '../Brand';
import './styles.less';

export interface NavItemData {
  eventKey: string;
  title: string;
  icon?: any;
  to?: string;
  target?: string;
  children?: NavItemData[];
}

export interface HeaderProps {
  navs: NavItemData[];
}

const renderUserProfileSpeaker = ({ onClose, left, top, className }: any, ref) => {
  const handleSelect = eventKey => {
    onClose();
    if (eventKey === 'signout') {
      // Handle sign out logic here
      console.log('Signing out...');
    } else {
      console.log('Selected:', eventKey);
    }
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item panel style={{ padding: 15, width: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Avatar 
              size="md" 
              circle 
              style={{ 
                backgroundColor: '#3498db', 
                color: 'white', 
                marginRight: 12 
              }}
            >
              A
            </Avatar>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Administrator</div>
              <div style={{ fontSize: '12px', color: '#666' }}>admin@university.in</div>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '12px', 
            color: '#28a745' 
          }}>
            <span style={{ 
              width: 8, 
              height: 8, 
              backgroundColor: '#28a745', 
              borderRadius: '50%', 
              marginRight: 6 
            }}></span>
            Online
          </div>
        </Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item eventKey="profile">My Profile</Dropdown.Item>
        <Dropdown.Item eventKey="settings">Account Settings</Dropdown.Item>
        <Dropdown.Item eventKey="preferences">Preferences</Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item eventKey="help">
          <HelpOutlineIcon style={{ marginRight: 8 }} />
          Help & Support
        </Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item eventKey="signout" style={{ color: '#f44336' }}>
          Sign Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

const renderSettingSpeaker = ({ onClose, left, top, className }: any, ref) => {
  const handleSelect = eventKey => {
    onClose();
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
          <strong>Settings</strong>
        </Dropdown.Item>
        <Dropdown.Item>Item 1</Dropdown.Item>
        <Dropdown.Item>Item 2</Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Item 3</Dropdown.Item>
        <Dropdown.Item>Item 4</Dropdown.Item>
        <Dropdown.Item>Item 5</Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Item 6</Dropdown.Item>
        <Dropdown.Item>Item 7</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};


const Header = (props: HeaderProps) => {
  const { navs } = props;
  const trigger = useRef<WhisperInstance>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (to: string) => {
    if (to) {
      navigate(to);
    }
  };

  const renderNavMenu = (item: NavItemData) => {
    if (item.children) {
      return (
        <Dropdown
          key={item.eventKey}
          title={
            <Button 
              appearance={location.pathname.includes(item.eventKey) ? 'primary' : 'subtle'} 
              style={{ marginRight: 8 }}
            >
              {item.icon} {item.title}
            </Button>
          }
          trigger="hover"
        >
          {item.children.map(child => (
            <Dropdown.Item
              key={child.eventKey}
              onSelect={() => handleNavClick(child.to || '')}
            >
              {child.title}
            </Dropdown.Item>
          ))}
        </Dropdown>
      );
    }

    if (item.target === '_blank') {
      return (
        <Button
          key={item.eventKey}
          appearance="subtle"
          style={{ marginRight: 8 }}
        >
          {item.icon} {item.title}
        </Button>
      );
    }

    return (
      <Button
        key={item.eventKey}
        appearance={location.pathname === item.to ? 'primary' : 'subtle'}
        style={{ marginRight: 8 }}
        onClick={() => handleNavClick(item.to || '')}
      >
        {item.icon} {item.title}
      </Button>
    );
  };

  return (
    <Navbar className="header nav-header">
      <Stack justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
        <Stack alignItems="center" spacing={20}>
          <div className="nav-brand">
            <Brand />
          </div>
          <div className="nav-menu">
            {navs.map(renderNavMenu)}
          </div>
        </Stack>

        <div className="nav-actions">
          <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderSettingSpeaker}>
            <IconButton icon={<GearIcon style={{ fontSize: 20 }} />} />
          </Whisper>

          <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderUserProfileSpeaker}>
            <Avatar
              size="sm"
              circle
              style={{ 
                marginLeft: 8, 
                backgroundColor: '#3498db',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              A
            </Avatar>
          </Whisper>
        </div>
      </Stack>
    </Navbar>
  );
};

export default Header;
