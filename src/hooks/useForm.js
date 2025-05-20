import { useState } from "react";

export const useForm = (initialValues, validateForm) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle select change
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multiple select change
  const handleMultiSelectChange = (e, name) => {
    const value = e.target.value;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form reset
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  // Handle form submit
  const handleSubmit = async (e, onSubmit) => {
    e.preventDefault();

    if (validateForm) {
      const validationErrors = validateForm(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
    }
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    isSubmitting,
    handleChange,
    handleCheckboxChange,
    handleSelectChange,
    handleMultiSelectChange,
    resetForm,
    handleSubmit,
  };
};
