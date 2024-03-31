import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./examples/Signin";
import DashboardOverview from "../dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Purchase from '../Purchase/Purchase';
import Sales from '../Sales/Sales';
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ResetPassword from "./examples/ResetPassword";
import Valuetargets from "./examples/Valuetargets";
import Accountingsettings from "./examples/Accountingsettings";
import Supplierssettings from "./examples/Supplierssettings";
import BeginningInventory from '../Beginning/BeginningInventorysettings';
import Bomsettings from "./examples/Bomsettings";
import ChangeProfile from "./changeprofile";
import Inventory from '../Inventory/Inventory';
import IncomeStatement from '../IncomeStatement/IncomeStatement';

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";


const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    )}
    />
  );
};

export default () => (
  <Switch>
    <RouteWithLoader exact path={Routes.Presentation.path} component={Presentation} />
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />

    {/* pages */}
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
    <RouteWithSidebar exact path={Routes.ChangeProfile.path} component={ChangeProfile} />
    <RouteWithSidebar exact path={Routes.Purchase.path} component={Purchase} />
    <RouteWithSidebar exact path={Routes.Sales.path} component={Sales} />
    <RouteWithSidebar exact path={Routes.Transactions.path} component={Transactions} />
    <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} />
    <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} />
    <RouteWithSidebar exact path={Routes.Valuetargets.path} component={Valuetargets} />
    <RouteWithSidebar exact path={Routes.Accountingsettings.path} component={Accountingsettings} />
    <RouteWithSidebar exact path={Routes.Supplierssettings.path} component={Supplierssettings} />
    <RouteWithSidebar exact path={Routes.BeginningInventorysettings.path} component={BeginningInventory} />
    <RouteWithSidebar exact path={Routes.Bomsettings.path} component={Bomsettings} />
    <RouteWithSidebar exact path={Routes.Inventory.path} component={Inventory} />
    <RouteWithSidebar exact path={Routes.IncomeStatement.path} component={IncomeStatement} />
    <Redirect to={Routes.NotFound.path} />
  </Switch>
);
