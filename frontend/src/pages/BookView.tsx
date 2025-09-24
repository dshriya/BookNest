import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Rating,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { googleBooksService, GoogleBookResponse } from '../services/googleBooks';
import { libraryService } from '../services/library';

const Grid = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '-16px',  // Compensate for item padding
}));

const GridItem = styled('div')(({ theme }) => ({
  padding: '16px',
  width: '100%',
  '@media (min-width: 600px)': {
    width: '50%',
  },
  '@media (min-width: 960px)': {
    width: '66.666%',
  },
  '&.small': {
    '@media (min-width: 960px)': {
      width: '33.333%',
    },
  },
}));

const BookView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<GoogleBookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [inNest, setInNest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;

      try {
        const [bookDetails, bookStatus] = await Promise.all([
          googleBooksService.getBookDetails(id),
          libraryService.getBookStatus(id)
        ]);
        setBook(bookDetails);
        if (bookStatus) {
          setLiked(bookStatus.isLiked);
          setInNest(bookStatus.inNest);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleLike = async () => {
    if (!book) return;

    try {
      const response = await libraryService.toggleLike(book);
      if (response.success) {
        const newStatus = !liked;
        setLiked(newStatus);
        setSnackbarMessage(newStatus ? 'Book added to your liked books!' : 'Book removed from liked books');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setSnackbarMessage('Failed to update like status');
      setSnackbarOpen(true);
    }
  };

  const handleAddToNest = async () => {
    if (!book) return;

    try {
      const response = await libraryService.toggleNest(book);
      if (response.success) {
        const newStatus = !inNest;
        setInNest(newStatus);
        setSnackbarMessage(newStatus ? 'Book added to your nest!' : 'Book removed from your nest');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error toggling nest status:', error);
      setSnackbarMessage('Failed to update nest status');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error || 'Book not found'}</Typography>
      </Box>
    );
  }

  const { volumeInfo } = book;

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
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Grid>
            <GridItem className="small">
              <Box
                component="img"
                src={googleBooksService.getValidImageUrl(book)}
                alt={volumeInfo.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />

              <Box mt={2} display="flex" justifyContent="center" gap={2}>
                <Button
                  variant={liked ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleLike}
                >
                  {liked ? 'Liked' : 'Like'}
                </Button>
                <Button
                  variant={inNest ? 'contained' : 'outlined'}
                  color="secondary"
                  startIcon={inNest ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
                  onClick={handleAddToNest}
                >
                  {inNest ? 'In Nest' : 'Add to Nest'}
                </Button>
              </Box>
            </GridItem>

            <GridItem>
              <Typography variant="h4" gutterBottom>
                {volumeInfo.title}
                {volumeInfo.subtitle && (
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {volumeInfo.subtitle}
                  </Typography>
                )}
              </Typography>

              <Typography variant="h6" color="text.secondary" gutterBottom>
                by {volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </Typography>

              {volumeInfo.averageRating && (
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Rating value={volumeInfo.averageRating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({volumeInfo.ratingsCount} ratings)
                  </Typography>
                </Box>
              )}

              <Box my={2}>
                {volumeInfo.categories?.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    sx={{ mr: 1, mb: 1 }}
                    variant="outlined"
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {volumeInfo.description ? 
                  volumeInfo.description.replace(/<[^>]*>/g, '') 
                  : 'No description available.'}
              </Typography>

              <Box mt={3}>
                <Grid>
                  {volumeInfo.publisher && (
                    <GridItem>
                      <Typography variant="body2" color="text.secondary">
                        Publisher: {volumeInfo.publisher}
                      </Typography>
                    </GridItem>
                  )}
                  {volumeInfo.publishedDate && (
                    <GridItem>
                      <Typography variant="body2" color="text.secondary">
                        Published: {new Date(volumeInfo.publishedDate).toLocaleDateString()}
                      </Typography>
                    </GridItem>
                  )}
                  {volumeInfo.pageCount && (
                    <GridItem>
                      <Typography variant="body2" color="text.secondary">
                        Pages: {volumeInfo.pageCount}
                      </Typography>
                    </GridItem>
                  )}
                  {volumeInfo.language && (
                    <GridItem>
                      <Typography variant="body2" color="text.secondary">
                        Language: {volumeInfo.language.toUpperCase()}
                      </Typography>
                    </GridItem>
                  )}
                  {volumeInfo.industryIdentifiers?.map((identifier) => (
                    <GridItem key={identifier.type}>
                      <Typography variant="body2" color="text.secondary">
                        {identifier.type.replace('_', ' ')}: {identifier.identifier}
                      </Typography>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </GridItem>
          </Grid>
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

export default BookView;