import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CircularProgress,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { GoogleBookResponse } from '../services/googleBooks';
import { libraryService } from '../services/library';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`library-tabpanel-${index}`}
      aria-labelledby={`library-tab-${index}`}
      {...other}
      sx={{ pt: 3 }}
    >
      {value === index && children}
    </Box>
  );
};

const Grid = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '-12px',
}));

const GridItem = styled('div')(({ theme }) => ({
  padding: '12px',
  width: '100%',
  '@media (min-width: 600px)': {
    width: '50%',
  },
  '@media (min-width: 960px)': {
    width: '33.333%',
  },
  '@media (min-width: 1280px)': {
    width: '25%',
  },
}));

const Library = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedBooks, setLikedBooks] = useState<GoogleBookResponse[]>([]);
  const [nestBooks, setNestBooks] = useState<GoogleBookResponse[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const [liked, nest] = await Promise.all([
          libraryService.getLikedBooks(),
          libraryService.getNestBooks(),
        ]);
        setLikedBooks(liked);
        setNestBooks(nest);
      } catch (error) {
        console.error('Error fetching library books:', error);
        setSnackbarMessage('Failed to load your books');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleToggleLike = async (book: GoogleBookResponse) => {
    try {
      const response = await libraryService.toggleLike(book);
      if (response.success) {
        setLikedBooks(books => books.filter(b => b.id !== book.id));
        setSnackbarMessage('Book removed from liked books');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setSnackbarMessage('Failed to update like status');
      setSnackbarOpen(true);
    }
  };

  const handleToggleNest = async (book: GoogleBookResponse) => {
    try {
      const response = await libraryService.toggleNest(book);
      if (response.success) {
        setNestBooks(books => books.filter(b => b.id !== book.id));
        setSnackbarMessage('Book removed from your nest');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error toggling nest status:', error);
      setSnackbarMessage('Failed to update nest status');
      setSnackbarOpen(true);
    }
  };

  const renderBookGrid = (books: GoogleBookResponse[], isNestTab: boolean) => (
    <Grid>
      {books.map((book) => (
        <GridItem key={book.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 2,
              position: 'relative',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              }
            }}
          >
            <CardActionArea
              onClick={() => navigate(`/book/${book.id}`)}
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
              <CardMedia
                component="img"
                height="280"
                image={book.volumeInfo.imageLinks?.thumbnail || '/book-icon.svg'}
                alt={book.volumeInfo.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {book.volumeInfo.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                </Typography>
              </CardContent>
            </CardActionArea>
            <Button
              variant="contained"
              color={isNestTab ? "secondary" : "primary"}
              startIcon={isNestTab ? <BookmarkAddedIcon /> : <FavoriteIcon />}
              onClick={() => isNestTab ? handleToggleNest(book) : handleToggleLike(book)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                borderRadius: '20px',
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                color: 'error.main',
                border: '1px solid',
                borderColor: 'error.light',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white',
                  borderColor: 'error.dark'
                }
              }}
            >
              Remove
            </Button>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
        position: 'relative',
        backgroundImage: 'url(/cute-pattern.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            My Library
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="library tabs"
              variant="fullWidth"
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon />
                    <span>Liked Books ({likedBooks.length})</span>
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookmarkAddedIcon />
                    <span>My Nest ({nestBooks.length})</span>
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TabPanel value={activeTab} index={0}>
                {likedBooks.length > 0 ? (
                  renderBookGrid(likedBooks, false)
                ) : (
                  <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
                    You haven't liked any books yet. Browse and like books to see them here!
                  </Typography>
                )}
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                {nestBooks.length > 0 ? (
                  renderBookGrid(nestBooks, true)
                ) : (
                  <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
                    Your nest is empty. Add books to your nest to keep track of them!
                  </Typography>
                )}
              </TabPanel>
            </>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Library;