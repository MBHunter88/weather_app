import React from 'react';

// Reusable Form component
const Form = ({ value, onChange, onSubmit, placeholder, buttonText }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default Form;
