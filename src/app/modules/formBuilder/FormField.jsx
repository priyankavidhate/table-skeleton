import React from 'react';

const FormField = ({ field, value, onChange }) => {
  const { type, name, label, options } = field;

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value, type)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-500"
            placeholder={`Enter your ${label.toLowerCase()}`}
            aria-describedby={`${name}-description`}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-3" role="radiogroup" aria-labelledby={`${name}-legend`}>
            {options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${name}_${option}`}
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(name, e.target.value, type)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 focus:ring-2"
                />
                <label htmlFor={`${name}_${option}`} className="ml-3 text-sm font-medium text-gray-700 capitalize cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value, type)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition duration-200 text-gray-900"
            aria-describedby={`${name}-description`}
          >
            <option value="">Please select an option</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiSelect':
        return (
          <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50" role="group" aria-labelledby={`${name}-legend`}>
            {options.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${name}_${option}`}
                  name={name}
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => onChange(name, option, type)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded focus:ring-2"
                />
                <label htmlFor={`${name}_${option}`} className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      {(type === 'checkbox' || type === 'multiSelect') ? (
        <fieldset className="border-0">
          <legend id={`${name}-legend`} className="block text-base font-semibold text-gray-900 mb-4">
            {label}
            {type === 'multiSelect' && <span className="text-sm text-gray-500 font-normal ml-2">(Select all that apply)</span>}
          </legend>
          {renderInput()}
        </fieldset>
      ) : (
        <>
          <label htmlFor={name} className="block text-base font-semibold text-gray-900 mb-2">
            {label}
          </label>
          {renderInput()}
        </>
      )}
    </div>
  );
};

export default FormField; 