import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    DialogActions,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions/transition'
import React from 'react'

// Transition

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction='up' ref={ref} {...props} />
    })

export default function ConfirmDialog({title, message, onConfirm, open, onClose}) {    
    return (
        <>
            {open && (
                <Dialog className='dialog__confirm' open={open} TransitionComponent={Transition} keepMounted onClose={onClose.bind(this)}> 
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose.bind(this)}>No</Button>
                        <Button onClick={() => {
                            onConfirm()
                            onClose()
                        }}>Yes</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}   