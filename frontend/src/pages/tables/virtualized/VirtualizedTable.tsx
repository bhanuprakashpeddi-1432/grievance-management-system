import React from 'react';
import { DOMHelper, Table, Badge } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

const VirtualizedTable = ({ sampledata }) => {
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
    <Table
      virtualized
      height={Math.max(getHeight(window) - 200, 400)}
      translate3d={false}
      data={sampledata}
    >
      <Column width={120} align="center" fixed>
        <HeaderCell>ID</HeaderCell>
        <Cell dataKey="id" />
      </Column>

      <Column width={180}>
        <HeaderCell>Name</HeaderCell>
        <Cell dataKey="Name" />
      </Column>

      <Column width={80}>
        <HeaderCell>Gender</HeaderCell>
        <Cell dataKey="gender" />
      </Column>

      <Column width={120}>
        <HeaderCell>Branch</HeaderCell>
        <Cell dataKey="branch" />
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

      <Column minWidth={200} flexGrow={1}>
        <HeaderCell>Email</HeaderCell>
        <Cell dataKey="email" />
      </Column>

      <Column width={300}>
        <HeaderCell>Problem Description</HeaderCell>
        <Cell dataKey="problem" />
      </Column>
    </Table>
  );
};

export default VirtualizedTable;
