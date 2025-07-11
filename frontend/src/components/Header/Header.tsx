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
import Brand from '../Brand';
import { useAuth } from '@/contexts/AuthContext';
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
  const { logout, state } = useAuth();

  const handleNavClick = (to: string) => {
    if (to) {
      navigate(to);
    }
  };

  const renderUserProfileSpeaker = ({ onClose, left, top, className }: any, ref) => {
    const handleSelect = async eventKey => {
      onClose();
      if (eventKey === 'signout') {
        await logout();
        navigate('/sign-in');
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
                src={`https://avatars.dicebear.com/api/initials/${state.user?.first_name || 'U'} ${state.user?.last_name || 'U'}.svg`}
                style={{ marginRight: 8 }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {state.user?.first_name} {state.user?.last_name}
                </div>
                <div style={{ fontSize: '0.8em', color: '#999' }}>
                  {state.user?.email}
                </div>
              </div>
            </div>
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item eventKey="profile">Profile</Dropdown.Item>
          <Dropdown.Item eventKey="settings">Settings</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item eventKey="signout">Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
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
              {state.user?.first_name?.charAt(0) || 'U'}{state.user?.last_name?.charAt(0) || 'U'}
            </Avatar>
          </Whisper>
        </div>
      </Stack>
    </Navbar>
  );
};

export default Header;
