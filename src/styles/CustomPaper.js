import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomPaper = styled(Paper)(({ theme, ...props }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  color: theme.palette.text.primary,
  width: '400px',
  margin: '2em auto 1em auto',
  boxShadow: '2px 5px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  lineHeight: '60px',
  fontSize: 16,
  padding: '0 1.8rem',
  display: 'flex',
  flexDirection: 'column'
}));

export default CustomPaper;
