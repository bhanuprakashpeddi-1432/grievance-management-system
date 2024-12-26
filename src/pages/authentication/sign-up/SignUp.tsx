import React, { useState } from 'react';
import { Form, Button, Panel, InputGroup, Stack, Checkbox, Divider } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '@/components/Brand';
import axios from 'axios';

const Register = () => {
  const [visible, setVisible] = useState(false);
  const history = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const handleInputChange = (name, value) => {
    setUser({
      ...user,
      [name]: value,
    });
  };

  const register = () => {
    axios
      .post('http://localhost:3000/register', user) // Make a POST request to the server
      .then(res => {
        alert(res.data.message);
        history('/dashboard');
      })
      .catch(error => {
        alert('registration done');
        history('/');
        console.error(error);
      });
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '100vh',
      }}
    >
      <Brand style={{ marginBottom: 10 }} />
      <Panel header={<h3>Create an Account</h3>} bordered style={{ background: '#fff', width: 400 }}>
        <p>
          <span>Already have an account?</span> <Link to="/sign-in">Sign in here</Link>
        </p>

        <Divider>OR</Divider>

        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Username</Form.ControlLabel>
            <Form.Control
              name="username"
              type="text"
              value={user.username}
              onChange={value => handleInputChange('username', value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control
              name="email"
              value={user.email}
              onChange={value => handleInputChange('email', value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Password</Form.ControlLabel>
            <InputGroup inside style={{ width: '100%' }}>
              <Form.Control
                name="password"
                type={visible ? 'text' : 'password'}
                value={user.password}
                onChange={value => handleInputChange('password', value)}
                autoComplete="off"
              />
              <InputGroup.Button onClick={() => setVisible(!visible)}>
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Confirm Password</Form.ControlLabel>
            <Form.Control
              name="confirmPassword"
              type="password"
              value={user.confirmPassword}
              onChange={value => handleInputChange('confirmPassword', value)}
            />
          </Form.Group>

          <Form.Group>
            <Stack style={{ marginLeft: -10 }}>
              <Checkbox
                checked={user.agree}
                onChange={value => handleInputChange('agree', value)}
              >
                I Agree
              </Checkbox>
              <Button appearance="link">Terms and conditions.</Button>
            </Stack>
          </Form.Group>

          <Form.Group>
            <Stack spacing={6}>
              <Button appearance="primary" onClick={register}>
                Submit
              </Button>
            </Stack>
          </Form.Group>
        </Form>
      </Panel>
    </Stack>
  );
};

export default Register;
