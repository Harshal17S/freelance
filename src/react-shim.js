// Simple polyfill for useSyncExternalStore
if (typeof React !== 'undefined' && !React.useSyncExternalStore) {
  React.useSyncExternalStore = function(subscribe, getSnapshot) {
    const [state, setState] = React.useState(getSnapshot());
    
    React.useEffect(() => {
      const unsubscribe = subscribe(() => {
        setState(getSnapshot());
      });
      return unsubscribe;
    }, [subscribe, getSnapshot]);
    
    return state;
  };
}

export default React;
