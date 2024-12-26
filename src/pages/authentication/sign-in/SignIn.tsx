import React, { useState } from 'react';
import { Form, Button, Panel, IconButton, Stack, Divider } from 'rsuite';
import { Link } from 'react-router-dom';
import GithubIcon from '@rsuite/icons/legacy/Github';
import FacebookIcon from '@rsuite/icons/legacy/Facebook';
import GoogleIcon from '@rsuite/icons/legacy/Google';
import WechatIcon from '@rsuite/icons/legacy/Wechat';
import Brand from '@/components/Brand';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const history = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const handleChange = e => {
    const { username, uvalue } = e.target;
    const { password, pvalue} = e.target;

    setUser({
      ...user,
      [username]: uvalue,
      [password]:pvalue,
    });
  };


  const login = () => {
    // Assuming you have axios imported
    axios.post('http://localhost:3000/login', user)
      .then(res => {
        alert(res.data.message);
        history('/dashboard');
      })
      .catch(error => {
        history('/dashboard');
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
        boxShadow: '0 10px 10px aqua', // Fix the box-shadow property
      }}
    >
      <Brand style={{ marginBottom: 10 }} />

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Sign In</h3>}>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Username or email address</Form.ControlLabel>
            <Form.Control name="username" onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>
              <span>Password</span>
            </Form.ControlLabel>
            <Form.Control name="password" type="password" onChange={handleChange} />
            <a style={{ float: 'right' }}>Forgot password?</a>
          </Form.Group>
          <p style={{ marginBottom: 20 }}>
            <span className="text-muted">New Here? </span>
            <Link to="/sign-up"> Create an Account</Link>
          </p>
          <Form.Group>
            <Stack spacing={6} divider={<Divider vertical />}>
              <Button appearance="primary" onClick={login}>
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

export default SignUp;
