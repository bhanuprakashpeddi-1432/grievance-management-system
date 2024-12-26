import React from 'react';
import { DOMHelper, Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;



const VirtualizedTable = ({ sampledata }) => {
  return (
    
    <Table
      virtualized
      height={Math.max(getHeight(window) - 120, 400)}
      translate3d={false}
      data={sampledata}
    >
      <Column width={200} align="center" fixed>
        <HeaderCell>Id</HeaderCell>
        <Cell dataKey="id" />
      </Column>

      <Column width={130}>
        <HeaderCell>Name</HeaderCell>
        <Cell dataKey="Name" />
      </Column>

      <Column width={150}>
        <HeaderCell>Gender</HeaderCell>
        <Cell dataKey="gender" />
      </Column>

      <Column width={150}>
        <HeaderCell>Branch</HeaderCell>
        <Cell dataKey="branch" />
      </Column>

      <Column minWidth={200} flexGrow={1} align="center">
        <HeaderCell>Email</HeaderCell>
        <Cell dataKey="email" />
      </Column>

      <Column width={400}>
        <HeaderCell>Problem-Description</HeaderCell>
        <Cell dataKey="problem" />
      </Column>
    </Table>
  );
};

export default VirtualizedTable;
