import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { CustomProvider, Container, Content } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import locales from './locales';
import Header from './components/Header';
import DashboardPage from './pages/dashboard';
import Error403Page from './pages/authentication/403';
import VirtualizedTablePage from './pages/tables/virtualized';
import FormBasicPage from './pages/forms/basic';
import SignInPage from './pages/authentication/sign-in';
import SignUpPage from './pages/authentication/sign-up';
import { appNavs } from './config';

const SimpleApp = () => {
  return (
    <IntlProvider locale="en" messages={locales.en}>
      <CustomProvider locale={enGB}>
        <Container style={{ height: '100vh', paddingTop: '70px' }}>
          <Header navs={appNavs} />
          <Content style={{ padding: '20px', overflow: 'auto' }}>
            <Routes>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />}/>
              <Route path="table-virtualized" element={<VirtualizedTablePage />} />
              <Route path="form-basic" element={<FormBasicPage />} />
              <Route path="error-403" element={<Error403Page />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-up" element={<SignUpPage />} />
              <Route path="*" element={<Error403Page />} />
            </Routes>
          </Content>
        </Container>
      </CustomProvider>
    </IntlProvider>
  );
};

export default SimpleApp;
