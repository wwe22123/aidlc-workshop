import { Backdrop, CircularProgress } from '@mui/material';

interface Props {
  open: boolean;
}

export default function Loading({ open }: Props) {
  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
