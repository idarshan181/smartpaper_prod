import { useRouter } from 'next/router';
import { useState } from 'react';
import useForm from '../lib/useForm';
import {
  Box,
  Button,
  Container,
  InputBase,
  InputLabel,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { CustomButton, CustomLabel } from '../styles/CustomForm';
const CustomPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '350px',
  margin: '1em auto',
  boxShadow: '2px 5px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  lineHeight: '60px',
  fontSize: '1.6rem',
  padding: '1rem 1.8rem 1.8rem 1.8rem'
}));

const CustomInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(0)
  },
  '& .MuiInputBase-input': {
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ccc',
    fontSize: '14px',
    borderRadius: '8px',
    width: '100%',
    padding: '10px 12px',
    margin: '0 0 15px 0',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow'
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Open Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      boxShadow: `#005fcc 0 0 0 0.1rem`,
      borderColor: '#005fcc'
    }
  }
}));

export default function SignIn() {
  const router = useRouter();
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    orgName: 'Smart Paper'
  });
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
    errorMessage: ''
  });

  const handleSubmit = event => {
    event.preventDefault();
    setState(prevState => ({
      ...prevState,
      isLoading: true
    }));
    const { orgName } = inputs;

    if (orgName.length > 0) {
      router.push({
        pathname: '/check',
        query: {
          orgName: orgName
        }
      });
    } else {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        isError: true,
        errorMessage: 'Organization name is required'
      }));
    }
  };

  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontWeight: 'bold'
          }}
        >
          Smart Paper
        </Typography>
        <CustomPaper elevation={3}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              component="h4"
              variant="h4"
              gutterBottom
              sx={{
                alignSelf: 'center',
                fontWeight: '600',
                margin: '0 8px 10px 8px',
                padding: 0,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#000000'
              }}
            >
              Details
            </Typography>
            <InputLabel
              htmlFor="orgName"
              sx={{
                margin: '0',
                textAlign: 'left',
                color: '#000000',
                fontWeight: '600',
                fontFamily: 'sans-serif',
                overflow: 'hidden',
                letterSpacing: '1px',
                textOverflow: 'ellipsis',
                fontSize: '12px'
              }}
            >
              Organization Name
            </InputLabel>
            <CustomInput
              margin="dense"
              required
              fullWidth
              name="orgName"
              label="Organization Name"
              type="text"
              id="orgName"
              autoComplete="orgName"
              aria-errormessage="my-helper-text"
              // value={inputs.orgName}
              onChange={handleChange}
              placeholder="Enter your organization name"
              autoFocus
            />

            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={!(inputs.orgName.length > 0)}
            >
              Get Started
            </CustomButton>
          </Box>
        </CustomPaper>
        {/* <Typography
          variant="h6"
          component="h6"
          gutterBottom
          sx={{
            border: "1px solid #25a5df",
            borderRadius: "8px",
            padding: "8px",
            width: "350px",
            textAlign: "center",
            color: "#25a5df",
          }}
        >
          Sample Info Text
        </Typography> */}
      </Box>
    </Container>
  );
}
