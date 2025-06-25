import React, { useState } from 'react';
import FormField from './FormField';

export default function FormBuilder({ formData }) {
  // Initialize form state with empty values for all fields
  const [formValues, setFormValues] = useState(() => {
    const initialValues = {};
    formData.fields.forEach(field => {
      if (field.type === 'multiSelect') {
        initialValues[field.name] = [];
      } else {
        initialValues[field.name] = '';
      }
    });
    return initialValues;
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes for different field types
  const handleInputChange = (fieldName, value, fieldType) => {
    setFormValues(prev => {
      if (fieldType === 'multiSelect') {
        const currentValues = prev[fieldName] || [];
        const updatedValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [fieldName]: updatedValues };
      } else {
        return { ...prev, [fieldName]: value };
      }
    });

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors = {};

    formData.fields.forEach(field => {
      const value = formValues[field.name];

      if (field.type === 'text' && (!value || value.trim() === '')) {
        newErrors[field.name] = `Please enter your  ${field.label} `;
      }

      if (field.type === 'text' && value && value.trim().length < 2) {
        newErrors[field.name] = `${field.label} must be at least 2 characters`;
      }
      if (field.type === 'checkbox' && (!value || value === '')) {
        newErrors[field.name] = `Please select a ${field.label.toLowerCase()}`;
      }
      if (field.type === 'multiSelect' && (!value || value.length === 0)) {
        newErrors[field.name] = `Please select at least one ${field.label.toLowerCase()}`;
      }

      if (field.type === 'select' && (!value || value === '')) {
        newErrors[field.name] = `Please select a ${field.label.toLowerCase()}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (formData.onSubmit) {
        formData.onSubmit(formValues);
      }
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  // Reset form
  const handleReset = () => {
    const resetValues = {};
    formData.fields.forEach(field => {
      if (field.type === 'multiSelect') {
        resetValues[field.name] = [];
      } else {
        resetValues[field.name] = '';
      }
    });
    setFormValues(resetValues);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-gray-600 mb-6">Thanks for applying! Our team will review your application soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-xl border border-gray-100">

      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.fields.map(field => (
          <div key={field.name}>
            <FormField
              field={field}
              value={formValues[field.name]}
              onChange={handleInputChange}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="pt-6 border-t border-gray-200 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Application
          </button>
          {isSubmitting && (
            <div className="flex justify-center mt-4">
              <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
