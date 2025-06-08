import React, { useState, useEffect } from 'react';
import { InputBase, Paper, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    // padding: '0 16px',
    boxSizing: 'border-box',
    [theme.breakpoints.up('sm')]: {
      // padding: '0 24px',
    },
    [theme.breakpoints.up('md')]: {
      // padding: '0 32px',
      maxWidth: '800px',
      margin: '0 auto',
    },
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    // padding: '2px 4px',
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(0),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f5f5f5',
    border: '1px solid #eaeaea',
    boxShadow: 'none',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(.5),
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: '0.9rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.85rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },
  iconButton: {
    padding: 10,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  clearButton: {
    padding: 8,
    visibility: props => props.showClearButton ? 'visible' : 'hidden',
  }
}));

export default function SearchBar({ searchQuery, onSearchChange, placeholder, themeColor }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const showClearButton = localSearchQuery.length > 0;
  const classes = useStyles({ showClearButton });
  
  // Debounce search to prevent excessive calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Trim the query to remove leading/trailing spaces
      const trimmedQuery = localSearchQuery.trim();
      onSearchChange(trimmedQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, onSearchChange]);

  const handleChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };
  
  const handleClear = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  // Prevent form submission which would cause page refresh
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={classes.container}>
      <Paper 
        component="form" 
        className={classes.root} 
        elevation={0}
        onSubmit={handleSubmit}
      >
        <InputBase
          className={classes.input}
          placeholder={placeholder || "Search menu items..."}
          value={localSearchQuery}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'search menu items' }}
        />
        {showClearButton && (
          <IconButton 
            className={classes.clearButton}
            aria-label="clear search" 
            onClick={handleClear}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton 
          className={classes.iconButton} 
          aria-label="search" 
          style={{ color: themeColor }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
}
