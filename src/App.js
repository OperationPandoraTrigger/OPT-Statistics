/* eslint import/no-webpack-loader-syntax: off */
import React, { useState } from "react";
import "hammerjs";
import LeftDrawer from "./components/leftDrawer/leftDrawer";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStyles } from "./styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import TopAppBar from "./components/topAppBar";
import NotFoundPage from "./components/notFoundPage";
import { responsiveFontSizes } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { IntlProvider } from "react-intl";
import NavigateToLatestBattle from "./components/shared/helpers/navigateToLatestWarEvent";
import BattleAnnouncement from "./components/battleAnnouncement/battleAnnouncement";
import Soontm from "./components/battleAnnouncement/soontm";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "moment/locale/de";
import moment from "moment";

moment.locale("de"); // it is required to select default locale manually

const firebaseConfig = {
  apiKey: "AIzaSyBvUv_Li0UnU_ypDnFwQ47EuwJDX_imdBg",
  authDomain: "opt-stats.firebaseapp.com",
  databaseURL: "https://opt-stats.firebaseio.com",
  projectId: "opt-stats",
  storageBucket: "opt-stats.appspot.com",
  messagingSenderId: "412471479558",
  appId: "1:412471479558:web:7404e841f4c882c9df6287",
};
firebase.initializeApp(firebaseConfig);

function App() {
  const theme = responsiveFontSizes(useTheme());
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <BrowserRouter>
      <IntlProvider locale={"de"}>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.root}>
              <CssBaseline />
              <TopAppBar onMenuClick={() => setDrawerOpen(true)} />
              <LeftDrawer
                onOpen={() => setDrawerOpen(true)}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
              />
              <main className={classes.main}>
                <Toolbar />
                <Routes basename={"/"}>
                  <Route
                    path={""}
                    element={
                      <Navigate replace to="battle-announcement/latest" />
                    }
                  />
                  <Route path={"battle-announcement"}>
                    <Route
                      path={""}
                      element={<Navigate replace to="latest" />}
                    />
                    <Route
                      path={"latest"}
                      element={<NavigateToLatestBattle />}
                    />
                    <Route path={"soontm"} element={<Soontm />} />
                    <Route
                      path={":battleId"}
                      element={<BattleAnnouncement />}
                    />
                  </Route>
                  <Route path="*">
                    <NotFoundPage />
                  </Route>
                </Routes>
              </main>
            </div>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </IntlProvider>
    </BrowserRouter>
  );
}

export default App;
