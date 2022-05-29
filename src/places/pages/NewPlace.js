import React from "react";

import Input from "../../shared/FormElements/Input/Input";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validators";
import "./NewPlace.css";

const NewPlace = () => {
  return (
    <form className="place-form">
      <Input
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Invalid input"
      />
    </form>
  );
};
export default NewPlace;
