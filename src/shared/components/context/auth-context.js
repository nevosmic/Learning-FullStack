import { createContext } from "react";

/*Object that has a react component->Provider that can be shared between components */
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
});
