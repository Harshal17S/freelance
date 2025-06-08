import React from 'react';
import { Typography, Box, Card, CardContent, Chip, Grid, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getParameterByName } from '../util';

const ProfileDetails = () => {
  let profile = null;
  try {
    const storedProfile = sessionStorage.getItem('customerInfo');
    profile = storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error('Error parsing profile data from sessionStorage', error);
  }

  // Retrieve merchantCode from the query params (fallback example: ?merchantCode=UPT99FLCPJ)
  const queryMerchantCode = getParameterByName('merchantCode');

  // Return default value if data is missing (except for phone)
  const getDefault = (value, defaultValue) =>
    value && value.toString().trim() !== '' ? value : defaultValue;

  // Generate initials from firstName and lastName
  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

  const backUrl = queryMerchantCode
    ? `/?merchantCode=${queryMerchantCode}` 
    : '/';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Back to Home Icon */}
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <IconButton onClick={() => (window.location.href = backUrl)}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Details
      </Typography>
      {profile ? (
        <Card sx={{ maxWidth: 600, width: '100%', p: 2, boxShadow: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12} container justifyContent="center">
                {/* Enhanced Profile Avatar */}
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: 36,
                    boxShadow: 3,
                    border: '4px solid #fff',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {getInitials(
                    getDefault(profile.firstName, 'No Name'),
                    getDefault(profile.lastName, '')
                  )}
                </Avatar>
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                <Typography variant="h5">
                  {getDefault(profile.firstName, 'No Name')}{' '}
                  {getDefault(profile.lastName, '')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Email: {getDefault(profile.customer.email, 'Email not provided')}
                </Typography>
                {profile.isEmailVerified ? (
                  <Chip label="Verified" color="success" size="small" sx={{ mt: 0.5 }} />
                ) : (
                  <Chip label="Not Verified" color="error" size="small" sx={{ mt: 0.5 }} />
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Phone: {profile.customer.phone}
                </Typography>
                {profile.customer.isPhoneVerified ? (
                  <Chip label="Verified" color="success" size="small" sx={{ mt: 0.5 }} />
                ) : (
                  <Chip label="Not Verified" color="error" size="small" sx={{ mt: 0.5 }} />
                )}
              </Grid>
              {profile.customerMerchant && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Merchant Code: {getDefault(profile.customerMerchant.merchantCode, queryMerchantCode || 'N/A')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1">No profile data available.</Typography>
      )}
    </Box>
  );
};

export default ProfileDetails;
