import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Rating, IconButton } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export function EditModal({ open, play, onClose, onSave, onDelete }) {
    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    open={open}
                    onClose={onClose}
                    maxWidth="sm"
                    fullWidth
                    PaperComponent={motion.div}
                    PaperProps={{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: 20 },
                        transition: { duration: 0.3 }
                    }}
                >
                    <DialogTitle sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'white'
                    }}>
                        Edit Play
                        <IconButton onClick={onClose} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Play Name"
                                defaultValue={play.name}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                label="Theatre"
                                defaultValue={play.theatre}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                defaultValue={play.date}
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Rating
                                    defaultValue={play.rating}
                                    precision={0.5}
                                    size="large"
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this play?')) {
                                    onDelete();
                                    toast.success('Play deleted successfully');
                                }
                            }}
                        >
                            Delete
                        </Button>
                        <Box sx={{ flex: 1 }} />
                        <Button
                            variant="outlined"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                onSave();
                                toast.success('Changes saved successfully');
                            }}
                            sx={{
                                ml: 1,
                                background: 'linear-gradient(45deg, #8B0000 30%, #DAA520 90%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5C0000 30%, #B8860B 90%)'
                                }
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </AnimatePresence>
    );
} 