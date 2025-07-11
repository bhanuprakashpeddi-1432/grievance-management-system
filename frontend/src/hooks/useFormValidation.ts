import { useState, useRef } from 'react';

interface UseFormValidationOptions<T> {
  initialData: T;
  validationModel: any;
  onSubmit: (data: T) => Promise<void>;
}

export const useFormValidation = <T extends Record<string, any>>({
  initialData,
  validationModel,
  onSubmit
}: UseFormValidationOptions<T>) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [formError, setFormError] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<any>(null);

  const handleChange = (value: any, name: string) => {
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

  const handleSubmit = async () => {
    if (!formRef.current?.check()) {
      return false;
    }

    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      resetForm();
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setFormError({});
    formRef.current?.cleanErrors();
  };

  return {
    formData,
    setFormData,
    formError,
    setFormError,
    isLoading,
    formRef,
    validationModel,
    handleChange,
    handleSubmit,
    resetForm
  };
};
