import { useState, useCallback } from "react";
import Router from "./routes";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./components/GlobalStyles";
import theme from "./theme";
import { AuthContext } from "./context/auth-context";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, login: login, logout: logout, userID: userID, token: token, setUserID: setUserID, setToken: setToken }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router />
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;
