import React from "react";
import useCustomForm from "./hooks/useCustomForm";

const Signin = () => {
  const { inputs, handleInputChange, handleSubmit, formSubmitted, resetForm } = useCustomForm();
  const { firstName } = inputs;

  return (
    <>
      {formSubmitted ? (
        <>
        <h3>Greetings! {firstName}</h3>
        <button type="submit" onClick={resetForm}>Enter New Name</button>
        </>
      ) : (
        <>
          <h3>Please Enter Your Name</h3>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="firstName"
              onChange={handleInputChange}
              value={firstName}
            ></input>
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </>
  );
};

export default Signin;
