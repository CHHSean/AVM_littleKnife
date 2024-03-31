import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import "./scss/volt.scss";
import "react-datetime/css/react-datetime.css";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import { ChatProvider } from "./api/context"

ReactDOM.render(
  <ChatProvider>
    <HashRouter>
      <ScrollToTop />
      <HomePage />
    </HashRouter>
  </ChatProvider>,
  document.getElementById("root")
);