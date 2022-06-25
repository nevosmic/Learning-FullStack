import React, { useState, useContext, Fragment } from "react";

import Card from "../../shared/components/UIElements/Card/Card";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import "./Authenticate.css";

const Authenticate = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(); //initial state -undefined

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      //switch to login
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      //switch to signup
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  //fires whenever we login/signup
  const authenticateSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (isLoginMode) {
      //LOGIN
      try {
        console.log("frontend login BEFORE FETCH");
        //send an http request with fetch/axios/..
        const response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // these values are valid- submit button if we have a valid form
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const responseData = await response.json();
        // 500/400 not considered an error cuz it is a response
        if (!response.ok) {
          console.log("responseData:", responseData);
          console.log(responseData.message);
          //response status is 400'sh/500'sh
          throw new Error(responseData.message); //my error messages from backend
        }
        console.log("responseData:", responseData);
        setIsLoading(false);
        auth.login();
      } catch (err) {
        console.log("err:", err);
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again.");
      }
    } else {
      //SIGNUP
      try {
        console.log("frontend signup BEFORE FETCH");
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const responseData = await response.json();
        // 500/400 not considered an error cuz it is a response
        if (!response.ok) {
          //response status is 400'sh/500'sh
          throw new Error(responseData.message); //my error messages from backend
        }
        console.log("responseData:", responseData);
        setIsLoading(false);
        auth.login(); // setIsLoggedIn(true);
      } catch (err) {
        console.log("err:", err);
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again.");
      }
    }
  };
  const showErrorModalHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal onClear={showErrorModalHandler} error={error} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay={true} />}
        <h2>Login required</h2>
        <hr />
        <form onSubmit={authenticateSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid username."
              onInput={inputHandler}
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password (at least 5 characters.)"
            onInput={inputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </Fragment>
  );
};
export default Authenticate;
