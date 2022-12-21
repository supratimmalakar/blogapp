import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeToast } from '../redux/toastReducer'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Toast() {
    const dispatch = useDispatch()
    const { open, message, severity } = useSelector(state => state.toast)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(closeToast())
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default Toast