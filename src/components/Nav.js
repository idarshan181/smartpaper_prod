/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Icon } from '@iconify/react';
import { Container, Grid, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import React from 'react';

import { CustomButton, OutlinedButton } from '../styles/CustomForm';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%'
});
const Nav1 = () => {
  return (
    <>
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          sx={{
            fontWeight: 'bold',
            marginBottom: '24px'
          }}
          gutterBottom
        >
          My SmartPaper &trade;
        </Typography>
      </Container>
      <Container disableGutters maxWidth="sm" component="main">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2
              }}
            >
              <Icon
                icon="la:chalkboard-teacher"
                style={{ fontSize: '48px', alignContent: 'center' }}
              />
            </Box>
            <Link
              href="http://teacher.mysmartpaper.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none'
              }}
            >
              <OutlinedButton variant="outlined" sx={{ width: '100%' }}>
                Go To Teacher Portal
              </OutlinedButton>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2
              }}
            >
              <Icon
                icon="ph:student-thin"
                style={{ fontSize: '48px', alignContent: 'center' }}
              />
            </Box>
            <Link
              href="/check"
              sx={{
                textDecoration: 'none'
              }}
            >
              <CustomButton variant="contained" sx={{ width: '100%' }}>
                Continue Scanning Assessment
              </CustomButton>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export { Nav1 };
