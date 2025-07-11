import React from 'react';
import * as errors from '@/images/errors';

interface ErrorPageProps {
  code?: number;
  children?: React.ReactNode;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code = 404, children }) => (
  <div className="error-page">
    <div className="item">
      <img src={(errors as any)[`Error${code}Img`]} alt={`Error ${code}`} />
      <div className="text">
        <h1 className="error-page-code">{code}</h1>
        {children}
      </div>
    </div>
  </div>
);

export default ErrorPage;
