import { Card, CardContent, CardMedia, Typography, IconButton, Box, Rating } from '@mui/material';
import { Edit as EditIcon, Star as StarIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export function PlayCard({ play }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&:hover .edit-button': {
                    opacity: 1
                }
            }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={play.image || '/default-theatre.jpg'}
                    alt={play.name}
                    sx={{
                        objectFit: 'cover'
                    }}
                />
                <IconButton
                    className="edit-button"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': {
                            bgcolor: 'white',
                            transform: 'scale(1.1)'
                        }
                    }}
                    onClick={() => handleEdit(play)}
                >
                    <EditIcon />
                </IconButton>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display' }}>
                        {play.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        {new Date(play.date).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Typography>
                    {play.theatre && (
                        <Typography variant="body2" color="text.secondary">
                            {play.theatre}
                        </Typography>
                    )}
                    {play.rating && (
                        <Box sx={{ mt: 2 }}>
                            <Rating
                                value={play.rating}
                                readOnly
                                precision={0.5}
                                icon={<StarIcon sx={{ color: 'secondary.main' }} />}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
} 