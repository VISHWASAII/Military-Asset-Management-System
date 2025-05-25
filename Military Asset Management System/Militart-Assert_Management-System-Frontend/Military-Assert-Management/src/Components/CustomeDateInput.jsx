import React from 'react';

const CustomDateInput = React.forwardRef(({ value, onClick, onFocus, onBlur }, ref) => {
  // Create combined handlers that do both:
  const handleFocus = (e) => {
    if (onFocus) onFocus(e);            // call passed onFocus if exists
    e.target.style.borderColor = '#5b9bd5';  // change border color on focus
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(e);              // call passed onBlur if exists
    e.target.style.borderColor = '#888';      // revert border color on blur
  };

  return (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      readOnly
      style={{
        width: '100%',
        padding: '10px 14px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1.5px solid #888',
        outline: 'none',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
        userSelect: 'none',
      }}
    />
  );
});

export default CustomDateInput;
