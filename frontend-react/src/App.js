import React from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import PageConfigMatrix from "./pages/PageConfigMatrix/PageConfigMatrix";
import PageMatrices from "./pages/PageMatrices/PageMatrices";
import PageLogin from "./pages/PageLogin/PageLogin";
import PageCalculations from "./pages/PageCalculations/PageCalculations";
import { useState } from "react";
import { AuthContext } from "./context";
import {
  checkAuthorization,
  deleteAuthDataFromLocalStorage,
  putAuthDataToLocalStorage,
} from "./utils/authorization";

function App() {
  const [isAuth, setIsAuth] = useState(() => {
    return checkAuthorization();
  });

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        putAuthDataToLocalStorage: putAuthDataToLocalStorage,
        deleteAuthDataFromLocalStorage: deleteAuthDataFromLocalStorage,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login/" element={<PageLogin />} />
          <Route path="/calculations/" element={<PageCalculations />} />
          <Route path="/matrix/configure/" element={<PageConfigMatrix />} />
          <Route path="/matrix/comparison/" element={<PageMatrices />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
