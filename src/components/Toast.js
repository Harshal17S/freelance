import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  toast: {
    marginBottom: theme.spacing(1),
    pointerEvents: 'auto',
    minWidth: '250px',
  },
  success: {
    backgroundColor: '#4caf50',
  },
  error: {
    backgroundColor: '#f44336',
  },
  info: {
    backgroundColor: '#2196f3',
  },
  warning: {
    backgroundColor: '#ff9800',
  },
}));

// Toast container to manage multiple toasts
let toastId = 0;
const toasts = [];
let setToastsState = null;

// Toast API
export const toast = {
  success: (message, options = {}) => {
    addToast({ message, type: 'success', ...options });
  },
  error: (message, options = {}) => {
    addToast({ message, type: 'error', ...options });
  },
  info: (message, options = {}) => {
    addToast({ message, type: 'info', ...options });
  },
  warn: (message, options = {}) => {
    addToast({ message, type: 'warning', ...options });
  }
};

const addToast = (toast) => {
  const id = toastId++;
  const newToast = {
    id,
    ...toast,
    duration: toast.duration || 3000,
  };
  
  toasts.push(newToast);
  if (setToastsState) {
    setToastsState([...toasts]);
  }
  
  // Auto-remove toast after duration
  setTimeout(() => {
    removeToast(id);
  }, newToast.duration);
  
  return id;
};

const removeToast = (id) => {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
    if (setToastsState) {
      setToastsState([...toasts]);
    }
  }
};

// Toast container component
export const ToastContainer = (props) => {
  const [toastsState, setToasts] = useState([]);
  const classes = useStyles();
  
  // Parse position from props or use default
  const getAnchorOrigin = () => {
    const defaultPosition = { vertical: 'top', horizontal: 'right' };
    
    if (!props.position) {
      return defaultPosition;
    }
    
    // If position is already in the correct format, use it
    if (typeof props.position === 'object' && 
        typeof props.position.vertical === 'string' && 
        typeof props.position.horizontal === 'string') {
      return props.position;
    }
    
    // Otherwise use default
    return defaultPosition;
  };
  
  useEffect(() => {
    setToastsState = setToasts;
    return () => {
      setToastsState = null;
    };
  }, []);

  // Get proper anchorOrigin value
  const anchorOrigin = getAnchorOrigin();

  return (
    <div className={classes.container}>
      {toastsState.map((toast) => (
        <Snackbar 
          key={toast.id}
          open={true}
          className={classes.toast}
          anchorOrigin={anchorOrigin}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={toast.type}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => removeToast(toast.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};
