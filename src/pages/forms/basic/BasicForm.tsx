import React from 'react';
import {
  Form,
  Input,
  InputPicker,
  Uploader,
  Message,
  Divider,
  Button,
  CheckPicker,
  ButtonToolbar,
} from 'rsuite';
import PageContent from '@/components/PageContent';

// import { mockTreeData } from '@/data/mock';

// const treeData = mockTreeData({ limits: [2, 3, 3], labels: ['Provincial', 'County', 'Town'] });

// const selectData = ['item1', 'item2', 'item3'].map(item => ({
//   label: item,
//   value: item
// }));

const problemTypeData = ['Academic', 'Administrative', 'Personal'].map(item => ({
  label: item,
  value: item
}));

const GenderData = ['Male', 'Female', 'Others'].map(item => ({
  label: item,
  value: item
}));

const Textarea = React.forwardRef<HTMLInputElement, any>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const BasicForm = () => {
  return (
    <PageContent>
      <Message>
        The following demonstrates creates the new greviance raised here by filling the below details
        <a href="" target="_blank" rel="noreferrer">
          form usage
        </a>
        .
      </Message>
      <Divider />
      <Form className="basic-form" layout="horizontal">
        <Form.Group controlId="Input">
          <Form.ControlLabel>Register ID </Form.ControlLabel>
          <Form.Control name="Input" />
        </Form.Group>

        <Form.Group controlId="Name-form">
          <Form.ControlLabel>Name </Form.ControlLabel>
          <Form.Control name="Name-form" />
        </Form.Group>

        <Form.Group controlId="Branch">
          <Form.ControlLabel>Branch</Form.ControlLabel>
          <Form.Control name="Branch" />
        </Form.Group>

        <Form.Group controlId="Gender">
          <Form.ControlLabel>Gender</Form.ControlLabel>
          <Form.Control name="Gender" accepter={InputPicker} data={GenderData} />
        </Form.Group>

        <Form.Group controlId="mobileNumber">
          <Form.ControlLabel>Mobile Number</Form.ControlLabel>
          <Form.Control name="mobileNumber" accepter={Input} />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" />
        </Form.Group>

        <Form.Group controlId="problemtype">
          <Form.ControlLabel>Problem-Type</Form.ControlLabel>
          <Form.Control name="problemtype" accepter={CheckPicker} data={problemTypeData} />
        </Form.Group>

        <Form.Group controlId="Textarea">
          <Form.ControlLabel>Problem-Description</Form.ControlLabel>
          <Form.Control name="Textarea" accepter={Textarea} rows={5} />
        </Form.Group>

        {/* <Form.Group controlId="InputNumber">
          <Form.ControlLabel>InputNumber</Form.ControlLabel>
          <Form.Control name="InputNumber" accepter={InputNumber} />
        </Form.Group>

        <Form.Group controlId="AutoComplete">
          <Form.ControlLabel>AutoComplete</Form.ControlLabel>
          <Form.Control name="AutoComplete" accepter={AutoComplete} data={selectData} />
        </Form.Group>

        <Form.Group controlId="Textarea">
          <Form.ControlLabel>Textarea</Form.ControlLabel>
          <Form.Control name="Textarea" accepter={Textarea} rows={3} />
        </Form.Group>

        <Form.Group controlId="checkbox">
          <Form.ControlLabel>Checkbox</Form.ControlLabel>
          <Form.Control name="checkbox" accepter={CheckboxGroup} inline style={{ marginLeft: -20 }}>
            <Checkbox value="HTML">HTML</Checkbox>
            <Checkbox value="CSS">CSS</Checkbox>
            <Checkbox value="Javascript">Javascript</Checkbox>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="radio">
          <Form.ControlLabel>Radio</Form.ControlLabel>
          <Form.Control name="radio" accepter={RadioGroup} inline style={{ marginLeft: -20 }}>
            <Radio value="HTML">HTML</Radio>
            <Radio value="CSS">CSS</Radio>
            <Radio value="Javascript">Javascript</Radio>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="datePicker">
          <Form.ControlLabel>DatePicker</Form.ControlLabel>
          <Form.Control name="datePicker" accepter={DatePicker} />
        </Form.Group>

        <Form.Group controlId="dateRangePicker">
          <Form.ControlLabel>DateRangePicker</Form.ControlLabel>
          <Form.Control name="dateRangePicker" accepter={DateRangePicker} />
        </Form.Group>

        <Form.Group controlId="checkPicker">
          <Form.ControlLabel>CheckPicker</Form.ControlLabel>
          <Form.Control name="checkPicker" accepter={CheckPicker} data={selectData} />
        </Form.Group>

        <Form.Group controlId="selectPicker">
          <Form.ControlLabel>SelectPicker</Form.ControlLabel>
          <Form.Control name="selectPicker" accepter={SelectPicker} data={selectData} />
        </Form.Group>

        <Form.Group controlId="tagPicker">
          <Form.ControlLabel>TagPicker</Form.ControlLabel>
          <Form.Control name="tagPicker" accepter={TagPicker} data={selectData} />
        </Form.Group>

        <Form.Group controlId="inputPicker">
          <Form.ControlLabel>InputPicker</Form.ControlLabel>
          <Form.Control name="inputPicker" accepter={InputPicker} data={selectData} />
        </Form.Group>

        <Form.Group controlId="cascader">
          <Form.ControlLabel>Cascader</Form.ControlLabel>
          <Form.Control name="cascader" accepter={Cascader} data={treeData} />
        </Form.Group>

        <Form.Group controlId="multiCascader">
          <Form.ControlLabel>MultiCascader</Form.ControlLabel>
          <Form.Control name="multiCascader" accepter={MultiCascader} data={treeData} />
        </Form.Group>

        <Form.Group controlId="TreePicker">
          <Form.ControlLabel>TreePicker</Form.ControlLabel>
          <Form.Control name="TreePicker" accepter={TreePicker} data={treeData} />
        </Form.Group>

        <Form.Group controlId="CheckTreePicker">
          <Form.ControlLabel>CheckTreePicker</Form.ControlLabel>
          <Form.Control name="CheckTreePicker" accepter={CheckTreePicker} data={treeData} />
        </Form.Group>

        <Form.Group controlId="rate">
          <Form.ControlLabel>Rate</Form.ControlLabel>
          <Form.Control name="rate" accepter={Rate} />
        </Form.Group> */}

        <Form.Group controlId="proof">
          <Form.ControlLabel>Proof</Form.ControlLabel>
          <Form.Control name="proof" accepter={Uploader} action="#" />
        </Form.Group>

        {/* <Form.Group controlId="Toggle">
          <Form.ControlLabel>Toggle</Form.ControlLabel>
          <Toggle style={{ lineHeight: '36px' }} />
        </Form.Group> */}

        <Form.Group>
          <ButtonToolbar>
            <Button appearance="primary">Submit</Button>
            <Button appearance="default">Cancel</Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </PageContent>
  );
};

export default BasicForm;
