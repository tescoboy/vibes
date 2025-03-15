import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import { theme } from './theme';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)'
            }}>
                <Header />
                <Container 
                    maxWidth="lg" 
                    sx={{ 
                        pt: 12, 
                        pb: 6 
                    }}
                >
                    {/* Your existing content */}
                </Container>
            </Box>
            <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </ThemeProvider>
    );
}

export default App; 