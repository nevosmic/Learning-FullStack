import React, { useReducer } from "react";

import { validate } from "../../utils/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      console.log("CHANGE");
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }

    default:
      return state;
  }
};
const Input = (props) => {
  const [currentState, dispatch] = useReducer(inputReducer, {
    value: "",
    isTouched: false,
    isValid: false,
  });

  const changeHandler = (event) => {
    //validate value
    //store value
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={currentState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={currentState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !currentState.isValid &&
        currentState.isTouched &&
        "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!currentState.isValid && currentState.isTouched && (
        <p>{props.errorText}</p>
      )}
    </div>
  );
};
export default Input;
