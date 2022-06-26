import React, { Fragment, useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

/* Fetch users from Backend every time this page loads.
BUT this components re-renders every time something in the page is changing- this will create an infinite loop
to work around that I use useEffect */

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // run some code only if some dependencies changes. Empty dependency-it will only run once.
  useEffect(() => {
    //Http GET request-triggers GET request in users-controllers that returns a list of users
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );
        //data is a json with an array of users
        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay={true} />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </Fragment>
  );
};
export default Users;
