import { useState } from 'react';

const useCustomForm = () => {
  const [inputs, setInputs] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    setFormSubmitted(true);
  }
  const handleInputChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const resetForm = (event) => {
    if (event) {
      event.preventDefault();
    }
    setFormSubmitted(false);
    setInputs({});
  }
  return {
    handleSubmit,
    handleInputChange,
    formSubmitted,
    inputs,
    resetForm
  };
};

export default useCustomForm