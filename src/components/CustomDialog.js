/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorOutline } from '@mui/icons-material';
import { Button, DialogActions, Paper, Stack, styled, } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '14px'
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const buttonStyle = {
  mt: 2,
  mr: 2
}
// export function CustomDialog(props) {
  export const CustomDialog = (props) => {
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
}

// export default CustomDialog;

export const ResetDialog = (props) => {
  const { children, onClose, open, onReset, ...other } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Reset Data`}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="h6"
        >
          {`Are you sure you wish to clear data?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          sx={{
            mr: 3,
            mb: 1.5
          }}
        >
          cancel
        </Button>
        <Button
          variant="outlined"
          startIcon={<ErrorOutline />}
          color="error"
          onClick={(e) => {
            onReset(e);
            onClose();
          }}
          sx={{
            mr:4,
            mb:1.5,
          }}
        >
          Reset Data
        </Button>
      </DialogActions>
    </Dialog>
  );
}
