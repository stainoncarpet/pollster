import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

import "bulma";
import "../../styles/styles.scss";

import Routes from "../../routes/Routes.jsx";
import { store, persistor } from "../../redux/store.js";
import bindSocket from "../../services/socketGenerator.js";

const App = () => {
  React.useEffect(() => {
    bindSocket();
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

export default App;