import React, { useState } from 'react';

const useCustomForm = (callback) => {
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

// const useCustomForm = () => {
//   const [values, setValues] = useState(initialValues || {});
//   const [touchedSignUpues])

//   const handleChange = (event) => {
//     const { target } = event;
//     const { name, value } = target;
//     event.persist();
//     setValues({...values, [name]: value})
//   }

//   const handleSubmit = (event) => {
//     const { target } = event;
//     const { name } = target;
//     setTouched({...touched, [name]: true})
//   }





// }

export default useCustomForm