/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorOutline } from '@mui/icons-material';
import { Button, DialogActions, Modal, Paper, Stack, styled, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/system';
import { useState } from 'react';

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
  const CustomDialog = (props) => {
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

const CustomModal = ({ onReset }) => {
  const [open, setOpen] = useState(true);
  
  return (
    <div>
      <Button
        variant="contained"
        type="reset"
        color="error"
        sx={{
          width: '116px',
          height: '36px',
          fontSize: '16px',
          lineHeight: '20px',
          textTransform: 'none',
          alignSelf: 'center',
          mr: 1,
          borderRadius: '8px',
          color: 'theme.palette.error.main'
        }}
        onClick={() => setOpen(!open)}
      >
        Clear Data
      </Button>
      <Modal
        open={!open}
        onClose={() => setOpen(!open)}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you wish to clear data?
          </Typography>
          <Button variant="outlined" onClick={() => setOpen(!open)} sx={buttonStyle}>
            close
          </Button>
          <Button
            variant="contained"
            onClick={e => {
              onReset(e);
              setOpen(!open);
            }}
            sx = {buttonStyle}
          >
            Clear
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
export {CustomDialog, CustomModal};
