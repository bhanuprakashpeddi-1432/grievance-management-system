import React, { useState, useEffect } from 'react';
import { Row, Col, Panel, Table, Badge, Progress, Stack, Divider, Button, Message, toaster } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import * as images from '../../images/charts';
import PieChart from './PieChart';
import { dashboardAPI, apiUtils } from '@/services/api';
import { DashboardStats } from '@/types/api';
import './styles.less';

const { Column, HeaderCell, Cell } = Table;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentGrievances, setRecentGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await dashboardAPI.getStats();
        setStats(statsResponse);
        
        // Fetch recent activities/grievances
        const activitiesResponse = await dashboardAPI.getRecentActivities(5);
        setRecentGrievances(activitiesResponse);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const apiError = apiUtils.handleError(error);
        toaster.push(
          <Message type="error" header="Error">
            {apiError.message}
          </Message>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Panel bordered style={{ textAlign: 'center', padding: 50 }}>
        <div>Loading dashboard data...</div>
      </Panel>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Pending': 'red',
      'In Progress': 'yellow',
      'Resolved': 'green'
    };
    return <Badge color={statusColors[status]} content={status} />;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      'High': 'red',
      'Medium': 'orange',
      'Low': 'green'
    };
    return <Badge color={priorityColors[priority]} content={priority} />;
  };

  return (
    <>
      {/* Welcome Section */}
      <Panel bordered style={{ marginBottom: 30, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Stack justifyContent="space-between" alignItems="center">
          <div>
            <h2 style={{ color: 'white', margin: 0 }}>Welcome to Grievance Management System</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '10px 0' }}>
              Monitor and manage grievances efficiently with real-time insights
            </p>
          </div>
          <Button 
            appearance="ghost" 
            style={{ color: 'white', borderColor: 'white' }}
            onClick={() => navigate('/form-basic')}
          >
            Create New Grievance
          </Button>
        </Stack>
      </Panel>

      {/* Statistics Cards */}
      <Row gutter={30} className="dashboard-header" style={{ marginBottom: 30 }}>
        <Col xs={6}>
          <Panel className="trend-box bg-gradient-red">
            <img className="chart-img" src={images.PVIcon} />
            <div className="title">Total Complaints</div>
            <div className="value">{stats?.total_grievances || 0}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>+12% from last month</div>
          </Panel>
        </Col>
        <Col xs={6}>
          <Panel className="trend-box bg-gradient-yellow">
            <img className="chart-img" src={images.VVIcon} />
            <div className="title">Pending Complaints</div>
            <div className="value">{stats?.pending_grievances || 0}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Requires attention</div>
          </Panel>
        </Col>
        <Col xs={6}>
          <Panel className="trend-box bg-gradient-green">
            <img className="chart-img" src={images.UVIcon} />
            <div className="title">Resolved Complaints</div>
            <div className="value">{stats?.resolved_grievances || 0}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>84% resolution rate</div>
          </Panel>
        </Col>
        <Col xs={6}>
          <Panel className="trend-box bg-gradient-blue">
            <img className="chart-img" src={images.UVIcon} />
            <div className="title">In Progress</div>
            <div className="value">{stats?.in_progress_grievances || 0}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Average 3.2 days</div>
          </Panel>
        </Col>
      </Row>

      {/* Progress Indicators */}
      <Row gutter={30} style={{ marginBottom: 30 }}>
        <Col xs={12}>
          <Panel bordered>
            <h5>Resolution Progress</h5>
            <Divider />
            <div style={{ marginBottom: 15 }}>
              <Stack justifyContent="space-between">
                <span>Academic Complaints</span>
                <span>87%</span>
              </Stack>
              <Progress percent={87} status="active" strokeColor="#4caf50" />
            </div>
            <div style={{ marginBottom: 15 }}>
              <Stack justifyContent="space-between">
                <span>Administrative Complaints</span>
                <span>76%</span>
              </Stack>
              <Progress percent={76} status="active" strokeColor="#2196f3" />
            </div>
            <div style={{ marginBottom: 15 }}>
              <Stack justifyContent="space-between">
                <span>Personal Complaints</span>
                <span>92%</span>
              </Stack>
              <Progress percent={92} status="active" strokeColor="#ff9800" />
            </div>
          </Panel>
        </Col>
        <Col xs={12}>
          <Panel bordered>
            <h5>Monthly Overview</h5>
            <Divider />
            <Row gutter={20}>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>156</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>This Month</div>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>3.2 days</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Avg Resolution</div>
                </div>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>94%</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Satisfaction Rate</div>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>12</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>High Priority</div>
                </div>
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      {/* Charts and Recent Grievances */}
      <Row gutter={30} style={{ marginBottom: 30 }}>
        <Col xs={16}>
          <Panel bordered>
            <h5>Complaint Distribution</h5>
            <Divider />
            <PieChart
              title="Complaints by Type"
              data={[450, 320, 180, 120, 53]}
              type="pie"
              labels={['Academic', 'Administrative', 'ERP', 'LMS', 'Other']}
            />
          </Panel>
        </Col>
        <Col xs={8}>
          <Panel bordered>
            <h5>Administrative Breakdown</h5>
            <Divider />
            <PieChart
              title="Administrative Categories"
              data={[98, 76, 54, 43, 29]}
              type="donut"
              labels={['Certificates', 'Hostel', 'Payments', 'Portals', 'Other']}
            />
          </Panel>
        </Col>
      </Row>

      {/* Recent Grievances Table */}
      <Row>
        <Col xs={24}>
          <Panel bordered>
            <Stack justifyContent="space-between" alignItems="center" style={{ marginBottom: 15 }}>
              <h5>Recent Grievances</h5>
              <Button 
                appearance="primary" 
                size="sm"
                onClick={() => navigate('/table-virtualized')}
              >
                View All
              </Button>
            </Stack>
            <Divider />
            <Table 
              data={recentGrievances} 
              height={300}
              bordered
              cellBordered
            >
              <Column width={80} align="center">
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
              </Column>
              <Column width={120}>
                <HeaderCell>Name</HeaderCell>
                <Cell dataKey="Name" />
              </Column>
              <Column width={100}>
                <HeaderCell>Type</HeaderCell>
                <Cell dataKey="type" />
              </Column>
              <Column width={120}>
                <HeaderCell>Status</HeaderCell>
                <Cell>
                  {rowData => getStatusBadge(rowData.status)}
                </Cell>
              </Column>
              <Column width={100}>
                <HeaderCell>Priority</HeaderCell>
                <Cell>
                  {rowData => getPriorityBadge(rowData.priority)}
                </Cell>
              </Column>
              <Column width={100}>
                <HeaderCell>Date</HeaderCell>
                <Cell dataKey="date" />
              </Column>
            </Table>
          </Panel>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
