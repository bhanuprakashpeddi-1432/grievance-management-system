import React, { useState } from 'react';
import { Form, Button, Panel, IconButton, Stack, Divider, Message, toaster } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';
import GithubIcon from '@rsuite/icons/legacy/Github';
import FacebookIcon from '@rsuite/icons/legacy/Facebook';
import GoogleIcon from '@rsuite/icons/legacy/Google';
import WechatIcon from '@rsuite/icons/legacy/Wechat';
import Brand from '@/components/Brand';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (value: any, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email || !formData.password) {
        toaster.push(
          <Message type="error" header="Error">
            Please fill in all required fields.
          </Message>
        );
        return;
      }

      await login(formData.email, formData.password);
      toaster.push(
        <Message type="success" header="Success">
          Welcome back! You have successfully signed in.
        </Message>
      );
      navigate('/dashboard');
    } catch (error: any) {
      toaster.push(
        <Message type="error" header="Login Failed">
          {error.response?.data?.message || 'Invalid email or password'}
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

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Sign In</h3>}>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Email address</Form.ControlLabel>
            <Form.Control 
              name="email" 
              type="email"
              value={formData.email}
              onChange={(value) => handleChange(value, 'email')}
              placeholder="Enter your email"
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>
              <span>Password</span>
            </Form.ControlLabel>
            <Form.Control 
              name="password" 
              type="password"
              value={formData.password}
              onChange={(value) => handleChange(value, 'password')}
              placeholder="Enter your password"
            />
            <a style={{ float: 'right' }}>Forgot password?</a>
          </Form.Group>
          <p style={{ marginBottom: 20 }}>
            <span className="text-muted">New Here? </span>
            <Link to="/sign-up"> Create an Account</Link>
          </p>
          <Form.Group>
            <Stack spacing={6} divider={<Divider vertical />}>
              <Button 
                appearance="primary" 
                onClick={handleSubmit}
                loading={state.isLoading}
                disabled={state.isLoading}
                block
              >
                Sign in
              </Button>
              <Stack spacing={6}>
                <IconButton icon={<WechatIcon />} appearance="subtle" />
                <IconButton icon={<GithubIcon />} appearance="subtle" />
                <IconButton icon={<FacebookIcon />} appearance="subtle" />
                <IconButton icon={<GoogleIcon />} appearance="subtle" />
              </Stack>
            </Stack>
          </Form.Group>
        </Form>
      </Panel>
    </Stack>
  );
};

export default SignIn;
