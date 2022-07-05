import { useState, useCallback, useEffect, useRef } from "react";
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(); //initial state -undefined

  //store data across re-render cycles
  const activeHttpRequests = useRef([]);

  /* useCallback so that this function never gets re-created
   when the components that uses this hook re-renders*/
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController(); //used to cancel the request
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        //send an http request with fetch/axios/..
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal, // link abortcontroller to this request
        });

        const responseData = await response.json(); // if we have a response the request completed

        //keeps every controller except for the one that was used in the current completed request
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        // 500/400 not considered an error cuz it is a response
        if (!response.ok) {
          console.log(responseData.message);
          //response status is 400'sh/500'sh
          throw new Error(responseData.message); //my error messages from backend
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    /*this returned function is executed as a clean up function 
before the next time useEffect runs again OR 
when the component that uses http-hook unmounts 
(user-case :before the http request is done the user moves to another page)*/
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
