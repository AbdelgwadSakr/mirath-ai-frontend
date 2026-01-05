import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./i18n/i18n";

import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Inheritance from "./pages/Inheritance";
import Assistant from "./pages/Assistant";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Results from "./pages/Results";
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />

        {/* Protected: Inheritance */}
        <Route
          path="/inheritance"
          element={
            <RequireAuth>
              <AppLayout>
                <Inheritance />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* Protected: Results */}
        <Route
          path="/results"
          element={
            <RequireAuth>
              <AppLayout>
                <Results />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* Assistant */}
        <Route
          path="/assistant"
          element={
            <AppLayout>
              <Assistant />
            </AppLayout>
          }
        />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AppLayout>
              <Register />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
