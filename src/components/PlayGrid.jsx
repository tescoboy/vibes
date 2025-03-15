import { Grid } from '@mui/material';
import { PlayCard } from './PlayCard';
import { motion } from 'framer-motion';

export function PlayGrid({ plays }) {
    return (
        <Grid container spacing={3}>
            {plays.map((play, index) => (
                <Grid item xs={12} sm={6} md={4} key={play.id}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <PlayCard play={play} />
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
} 