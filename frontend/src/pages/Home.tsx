import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Skeleton,
  Button
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import { useNavigate } from 'react-router-dom';
import { googleBooksService, GoogleBookResponse } from '../services/googleBooks';

const Home = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recommendedBooks, setRecommendedBooks] = useState<GoogleBookResponse[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const popularBooks = await googleBooksService.getPopularBooks();
        setRecommendedBooks(popularBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/books-pattern.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f5f5f5',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to BookNest
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Track your reading journey, discover new books, and connect with fellow readers.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ExploreIcon />}
            onClick={() => navigate('/search')}
            sx={{ mt: 2 }}
          >
            Explore Books
          </Button>
        </Paper>

        {/* Recommendations Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 1, mt: 4, mb: 2 }}>
          <Typography variant="h5">
            Popular Books
          </Typography>
          <Button
            color="primary"
            endIcon={<ExploreIcon />}
            onClick={() => navigate('/search')}
          >
            Explore More
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2, mb: 6 }}>
          {loading ? (
            [...Array(12)].map((_, index) => (
              <Box key={index} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' }, p: 2 }}>
                <Paper sx={{ height: '100%', borderRadius: 2 }}>
                  <Skeleton variant="rectangular" height={200} />
                  <Box sx={{ p: 2 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                </Paper>
              </Box>
            ))
          ) : (
            recommendedBooks.map((book, index) => (
              <Box key={book.id || index} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' }, p: 2 }}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/book/${book.id}`)}>
                    <CardMedia
                      component="img"
                      height="280"
                      image={googleBooksService.getValidImageUrl(book)}
                      alt={book.volumeInfo.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" noWrap>
                        {book.volumeInfo.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                        {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))
          )}
        </Box>


      </Container>
    </Box>
  );
};

export default Home;