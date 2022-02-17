import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Button, DialogActions, Paper, Stack, styled } from '@mui/material';

import { ErrorOutline } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '14px'
}));
const CustomDialog = props => {
  const { children, onClose, open, title, ans, reportError, ...other } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          <Item>Que No : {ans?.queNo}</Item>
          <Item>Student Ans: {ans?.studentAnswer}</Item>
          <Item
            style={{
              backgroundColor: '#3cff00'
            }}
          >
            Correct Ans: {ans?.correctAnswer[0]}
          </Item>
        </Stack>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<ErrorOutline />}
          color="error"
          onClick={reportError}
        >
          Error
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
