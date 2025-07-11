import React, { useState } from 'react';
import { Form, Button, Panel, InputGroup, Stack, Checkbox, Divider, Message, toaster } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { Link, useNavigate } from 'react-router-dom';
import Brand from '@/components/Brand';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { register, state } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    agree: false,
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name) {
        toaster.push(
          <Message type="error" header="Error">
            Please fill in all required fields.
          </Message>
        );
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toaster.push(
          <Message type="error" header="Error">
            Passwords do not match.
          </Message>
        );
        return;
      }

      if (formData.password.length < 6) {
        toaster.push(
          <Message type="error" header="Error">
            Password must be at least 6 characters long.
          </Message>
        );
        return;
      }

      if (!formData.agree) {
        toaster.push(
          <Message type="error" header="Error">
            You must agree to the terms and conditions.
          </Message>
        );
        return;
      }

      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      toaster.push(
        <Message type="success" header="Success">
          Registration successful! Please sign in with your credentials.
        </Message>
      );
      navigate('/sign-in');
    } catch (error: any) {
      toaster.push(
        <Message type="error" header="Registration Failed">
          {error.response?.data?.message || 'An error occurred during registration'}
        </Message>
      );
    }
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <Form.ControlLabel>First Name</Form.ControlLabel>
            <Form.Control
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={value => handleInputChange('first_name', value)}
              placeholder="Enter your first name"
            />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Last Name</Form.ControlLabel>
            <Form.Control
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={value => handleInputChange('last_name', value)}
              placeholder="Enter your last name"
            />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Username</Form.ControlLabel>
            <Form.Control
              name="username"
              type="text"
              value={formData.username}
              onChange={value => handleInputChange('username', value)}
              placeholder="Enter your username"
            />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={value => handleInputChange('email', value)}
              placeholder="Enter your email"
            />
          </Form.Group>
          
          <Form.Group>
            <Form.ControlLabel>Password</Form.ControlLabel>
            <InputGroup inside style={{ width: '100%' }}>
              <Form.Control
                name="password"
                type={visible ? 'text' : 'password'}
                value={formData.password}
                onChange={value => handleInputChange('password', value)}
                autoComplete="off"
                placeholder="Enter your password"
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
              value={formData.confirmPassword}
              onChange={value => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
            />
          </Form.Group>

          <Form.Group>
            <Stack style={{ marginLeft: -10 }}>
              <Checkbox
                checked={formData.agree}
                onChange={value => handleInputChange('agree', value)}
              >
                I Agree
              </Checkbox>
              <Button appearance="link">Terms and conditions.</Button>
            </Stack>
          </Form.Group>

          <Form.Group>
            <Stack spacing={6}>
              <Button 
                appearance="primary" 
                onClick={handleSubmit}
                loading={state.isLoading}
                disabled={state.isLoading}
                block
              >
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
