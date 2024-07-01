import CircularProgress from '@mui/material/CircularProgress';

export default function SimpleBackdrop() {


  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100%',marginTop:'15rem'}}>

        <CircularProgress color="inherit" />
    </div>
  );
}
