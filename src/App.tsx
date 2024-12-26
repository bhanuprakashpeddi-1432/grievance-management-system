import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { CustomProvider } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import locales from './locales';
import Frame from './components/Frame';
import DashboardPage from './pages/dashboard';
import Error403Page from './pages/authentication/403';

import SignInPage from './pages/authentication/sign-in';
import SignUpPage from './pages/authentication/sign-up';
import VirtualizedTablePage from './pages/tables/virtualized';
import FormBasicPage from './pages/forms/basic';
import { appNavs } from './config';

const App = () => {
  return (
    <IntlProvider locale="en" messages={locales.en}>
      <CustomProvider locale={enGB}>
        <Routes>
            <Route index element={<SignInPage />} />
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="sign-up" element={<SignUpPage />} />
            <Route path="" element={<Frame navs={appNavs} />}>
            <Route path="dashboard" element={<DashboardPage />}/>
            <Route path="table-virtualized" element={<VirtualizedTablePage />} />
            <Route path="error-403" element={<Error403Page />} />
            <Route path="form-basic" element={<FormBasicPage />} />
          </Route>
          <Route path="*" element={<Error403Page />} />
        </Routes>
      </CustomProvider>
    </IntlProvider>
  );
};

export default App;
