import React from 'react';
import { Row, Col, Panel } from 'rsuite';
import * as images from '../../images/charts';
import PieChart from './PieChart';

const Dashboard = () => {
  return (
    <>
      <Row gutter={30} className="dashboard-header">
        <Col xs={8}>
          <Panel className="trend-box bg-gradient-red">
            <img className="chart-img" src={images.PVIcon} />
            <div className="title">Total Complaints</div>
            <div className="value">1123</div>
          </Panel>
        </Col>
        <Col xs={8}>
          <Panel className="trend-box bg-gradient-green">
            <img className="chart-img" src={images.VVICon} />
            <div className="title">Process Complaints </div>
            <div className="value">106</div>
          </Panel>
        </Col>
        <Col xs={8}>
          <Panel className="trend-box bg-gradient-blue">
            <img className="chart-img" src={images.UVIcon} />
            <div className="title">Complaints solved</div>
            <div className="value">374</div>
          </Panel>
        </Col>
      </Row>

      <Row gutter={30}>
        <Col xs={16}>
          <PieChart
            title="complaints"
            data={[10000, 3000, 2000, 1000, 900]}
            type="pie"
            labels={['academic', 'administrative', 'erp', 'lms', 'Other']}
          />
        </Col>
        <Col xs={8}>
          <PieChart
            title="administrative complaints"
            data={[112332, 123221, 432334, 342334, 133432]}
            type="donut"
            labels={['certificates', 'hostel', 'payments', 'portals', 'Other']}
          />
        </Col>
      </Row>
    </>
    
  );
};

export default Dashboard;
