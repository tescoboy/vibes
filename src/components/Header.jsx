import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';

export default function Header() {
    return (
        <AppBar position="fixed" color="default" elevation={0} sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)'
        }}>
            <Container maxWidth="lg">
                <Toolbar>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <TheaterComedyIcon 
                                sx={{ 
                                    fontSize: 40, 
                                    color: 'primary.main',
                                    transform: 'rotate(-10deg)'
                                }} 
                            />
                            <Typography 
                                variant="h4" 
                                component="h1"
                                sx={{ 
                                    fontFamily: 'Playfair Display',
                                    fontWeight: 700,
                                    background: 'linear-gradient(45deg, #8B0000 30%, #DAA520 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                SeriousTheatre
                            </Typography>
                        </Box>
                    </motion.div>
                </Toolbar>
            </Container>
        </AppBar>
    );
} 