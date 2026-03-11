import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} data-testid="confirm-dialog">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} data-testid="confirm-dialog-cancel">취소</Button>
        <Button onClick={onConfirm} variant="contained" color="error" data-testid="confirm-dialog-confirm">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
