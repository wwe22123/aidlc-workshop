import { Snackbar, Alert, AlertColor } from '@mui/material';

interface Props {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export default function Toast({ open, message, severity, onClose }: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={severity === 'error' ? null : 3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
