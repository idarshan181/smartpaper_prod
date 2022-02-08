import { Button, InputBase, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomInput = styled(InputBase)(({ theme }) => ({
  ...theme.typography.body2,
  'label + &': {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    fontSize: 12
  },
  '& .MuiInputBase-input': {
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ccc',
    fontSize: 14,
    borderRadius: '8px',
    width: '100%',
    padding: '15px 20px',
    margin: '0',
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
    },
    '&:active': {
      boxShadow: `#005fcc 0 0 0 0.1rem`,
      borderColor: '#005fcc'
    }
  }
}));

const CustomLabel = ({ id, children, ...props }) => {
  return (
    <InputLabel
      sx={{
        fontSize: 12,
        color: '#000000',
        fontWeight: 'bold',
        fontFamily: 'Open Sans',
        margin: 'auto 8px 0px auto',
        padding: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...props.sx
      }}
      id={id}
    >
      {children}
    </InputLabel>
  );
};

const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: 3,
  fontSize: 14,
  borderRadius: 4,
  textTransform: 'none',
  backgroundColor: '#0d47a1',
  '&:hover': {
    backgroundColor: '#1a237e'
  }
}));

const Input = styled('input')({
  display: 'none'
});
export { CustomInput, CustomLabel, CustomButton, Input };
