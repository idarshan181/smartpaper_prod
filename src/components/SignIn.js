import React from 'react';
import { Container, Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CustomButton, OutlinedButton } from '../styles/CustomForm';
import { Icon } from '@iconify/react';

const SignIn = () => {
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
          variant="h3"
          align="center"
          sx={{
            fontWeight: 'bold',
            marginBottom: '24px'
          }}
          gutterBottom
        >
          mySmartPaper&trade;
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
                style={{ fontSize: '60px', alignContent: 'center' }}
              />
            </Box>
            <Link
              href="/teacher"
              sx={{
                textDecoration: 'none'
              }}
              // href="http://teacher.mysmartpaper.com"
              // target="_blank"
              // rel="noopener noreferrer"
              // sx={{
              //   textDecoration: 'none'
              // }}
            >
              <OutlinedButton
                variant="outlined"
                sx={{ width: '100%', fontSize: '24px' }}
              >
                I am a teacher
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
                color="#000"
                style={{ fontSize: '60px', alignContent: 'center' }}
              />
            </Box>
            <Link
              href="/check"
              sx={{
                textDecoration: 'none'
              }}
            >
              <CustomButton
                variant="contained"
                sx={{ width: '100%', fontSize: '24px' }}
              >
                I am a student
              </CustomButton>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignIn;
