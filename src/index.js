import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { IntlProvider } from 'react-intl'
import initLocalisation from './assets/util/localisation/initLocalisation';
import { StoreProvider } from './Store';
import installResizeObserverErrorHandler from './utils/resizeObserverErrorHandler';

// Polyfill for useSyncExternalStore (for libraries that might use it)
if (!React.useSyncExternalStore) {
  React.useSyncExternalStore = function(subscribe, getSnapshot) {
    const [state, setState] = React.useState(getSnapshot());
    
    React.useEffect(() => {
      const handleChange = () => {
        setState(getSnapshot());
      };
      
      const unsubscribe = subscribe(handleChange);
      return unsubscribe;
    }, [subscribe, getSnapshot]);
    
    return state;
  };
  
  React.useSyncExternalStore.shim = React.useSyncExternalStore;
}

// Ensure patched React is global
window.React = React;

// Install the global error handler for ResizeObserver errors
installResizeObserverErrorHandler();

const container = document.getElementById('root');
const localisation = initLocalisation()
console.log('-----Entory---');
ReactDOM.render(
  <BrowserRouter>
    <IntlProvider {...localisation}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </IntlProvider>
  </BrowserRouter>,
  container
);
