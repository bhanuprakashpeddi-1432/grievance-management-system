import React, { useState } from 'react';
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
  Schema,
  toaster,
  Notification,
} from 'rsuite';
import PageContent from '@/components/PageContent';
import './styles.less';
import { validateFileSize, validateFileType, getAllowedFileTypes } from '@/utils/validation';

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

// Form validation schema
const { StringType, ArrayType } = Schema.Types;

const validationModel = Schema.Model({
  registerId: StringType()
    .isRequired('Register ID is required')
    .pattern(/^[A-Za-z0-9]+$/, 'Register ID should only contain letters and numbers')
    .minLength(3, 'Register ID must be at least 3 characters long'),
  
  name: StringType()
    .isRequired('Name is required')
    .minLength(2, 'Name must be at least 2 characters long')
    .maxLength(50, 'Name cannot exceed 50 characters')
    .pattern(/^[A-Za-z\s]+$/, 'Name should only contain letters and spaces'),
  
  branch: StringType()
    .isRequired('Branch is required')
    .minLength(2, 'Branch must be at least 2 characters long'),
  
  gender: StringType()
    .isRequired('Gender is required'),
  
  mobileNumber: StringType()
    .isRequired('Mobile number is required')
    .pattern(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  
  email: StringType()
    .isRequired('Email is required')
    .isEmail('Please enter a valid email address'),
  
  problemType: ArrayType()
    .isRequired('Problem type is required')
    .minLength(1, 'Please select at least one problem type'),
  
  problemDescription: StringType()
    .isRequired('Problem description is required')
    .minLength(10, 'Problem description must be at least 10 characters long')
    .maxLength(500, 'Problem description cannot exceed 500 characters')
});

// Initial form data
const initialFormData = {
  registerId: '',
  name: '',
  branch: '',
  gender: '',
  mobileNumber: '',
  email: '',
  problemType: [] as string[],
  problemDescription: '',
  proof: [] as any[]
};

const Textarea = React.forwardRef<HTMLInputElement, any>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

const BasicForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const formRef = React.useRef<any>(null);

  // Handle form data changes
  const handleChange = (value: any, name: string) => {
    // Special handling for file uploads
    if (name === 'proof' && Array.isArray(value)) {
      const validFiles = handleFileUpload(value);
      value = validFiles;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formError[name]) {
      setFormError(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Enhanced form submission with file validation
  const handleFileUpload = (fileList: any[]) => {
    const allowedTypes = getAllowedFileTypes();
    const validFiles: any[] = [];
    const errors: string[] = [];

    for (const file of fileList) {
      if (!validateFileSize(file.blobFile || file)) {
        errors.push(`${file.name}: File size exceeds 5MB limit`);
        continue;
      }
      
      if (!validateFileType(file.blobFile || file, allowedTypes)) {
        errors.push(`${file.name}: File type not supported`);
        continue;
      }
      
      validFiles.push(file);
    }

    if (errors.length > 0) {
      toaster.push(
        <Notification type="warning" header="File Upload Warning">
          <div>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        </Notification>,
        { placement: 'topEnd' }
      );
    }

    return validFiles;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formRef.current?.check()) {
      toaster.push(
        <Notification type="error" header="Validation Error">
          Please fix the validation errors before submitting.
        </Notification>,
        { placement: 'topEnd' }
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success notification
      toaster.push(
        <Notification type="success" header="Success">
          Grievance submitted successfully! You will receive a confirmation email shortly.
        </Notification>,
        { placement: 'topEnd' }
      );
      
      // Reset form
      setFormData(initialFormData);
      formRef.current?.cleanErrors();
      
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Submission Error">
          Failed to submit grievance. Please try again later.
        </Notification>,
        { placement: 'topEnd' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormData);
    setFormError({});
    formRef.current?.cleanErrors();
  };

  return (
    <PageContent>
      <Message showIcon type="info">
        Please fill out all required fields to submit your grievance. Fields marked with <span style={{color: 'red'}}>*</span> are mandatory.
      </Message>
      <Divider />
      
      <Form 
        ref={formRef}
        model={validationModel}
        formValue={formData}
        onChange={(formValue: any) => setFormData(formValue)}
        onError={setFormError}
        className="basic-form" 
        layout="horizontal"
        fluid
      >
        <Form.Group controlId="registerId">
          <Form.ControlLabel>Register ID <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="registerId" 
            value={formData.registerId}
            onChange={value => handleChange(value, 'registerId')}
            placeholder="Enter your register ID"
          />
          <Form.HelpText>Enter your student/employee registration ID</Form.HelpText>
        </Form.Group>

        <Form.Group controlId="name">
          <Form.ControlLabel>Full Name <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="name" 
            value={formData.name}
            onChange={value => handleChange(value, 'name')}
            placeholder="Enter your full name"
          />
        </Form.Group>

        <Form.Group controlId="branch">
          <Form.ControlLabel>Branch/Department <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="branch" 
            value={formData.branch}
            onChange={value => handleChange(value, 'branch')}
            placeholder="Enter your branch or department"
          />
        </Form.Group>

        <Form.Group controlId="gender">
          <Form.ControlLabel>Gender <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="gender" 
            accepter={InputPicker} 
            data={GenderData} 
            value={formData.gender}
            onChange={value => handleChange(value, 'gender')}
            placeholder="Select your gender"
            searchable={false}
            cleanable={false}
          />
        </Form.Group>

        <Form.Group controlId="mobileNumber">
          <Form.ControlLabel>Mobile Number <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="mobileNumber" 
            accepter={Input} 
            value={formData.mobileNumber}
            onChange={value => handleChange(value, 'mobileNumber')}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
          />
          <Form.HelpText>Enter a valid 10-digit Indian mobile number</Form.HelpText>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.ControlLabel>Email Address <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="email" 
            type="email"
            value={formData.email}
            onChange={value => handleChange(value, 'email')}
            placeholder="Enter your email address"
          />
          <Form.HelpText>You will receive updates on this email address</Form.HelpText>
        </Form.Group>

        <Form.Group controlId="problemType">
          <Form.ControlLabel>Problem Type <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="problemType" 
            accepter={CheckPicker} 
            data={problemTypeData} 
            value={formData.problemType}
            onChange={value => handleChange(value, 'problemType')}
            placeholder="Select problem type(s)"
            cleanable={false}
          />
          <Form.HelpText>You can select multiple problem types</Form.HelpText>
        </Form.Group>

        <Form.Group controlId="problemDescription">
          <Form.ControlLabel>Problem Description <span style={{color: 'red'}}>*</span></Form.ControlLabel>
          <Form.Control 
            name="problemDescription" 
            accepter={Textarea} 
            rows={5} 
            value={formData.problemDescription}
            onChange={value => handleChange(value, 'problemDescription')}
            placeholder="Describe your problem in detail (minimum 10 characters)"
          />
          <Form.HelpText>
            Provide a detailed description of your grievance ({formData.problemDescription.length}/500 characters)
          </Form.HelpText>
        </Form.Group>

        <Form.Group controlId="proof">
          <Form.ControlLabel>Supporting Documents (Optional)</Form.ControlLabel>
          <Form.Control 
            name="proof" 
            accepter={Uploader} 
            action="#" 
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            value={formData.proof}
            onChange={value => handleChange(value, 'proof')}
          >
            <div style={{ lineHeight: '100px' }}>
              Click or Drag files to this area to upload
            </div>
          </Form.Control>
          <Form.HelpText>
            Upload supporting documents (PDF, DOC, images). Maximum file size: 5MB per file.
          </Form.HelpText>
        </Form.Group>

        <Form.Group>
          <ButtonToolbar>
            <Button 
              appearance="primary" 
              size="lg"
              loading={isLoading}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Grievance'}
            </Button>
            <Button 
              appearance="default" 
              size="lg"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset Form
            </Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </PageContent>
  );
};

export default BasicForm;
