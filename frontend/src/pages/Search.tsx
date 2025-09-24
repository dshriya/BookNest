import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  InputAdornment,
  Pagination,
  CircularProgress,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { googleBooksService, GoogleBookResponse } from '../services/googleBooks';

const Grid = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  margin: '-12px',  // Compensate for item padding
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

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState<GoogleBookResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const searchBooks = async (query: string, pageNumber: number) => {
    if (!query.trim()) {
      setBooks([]);
      setTotalItems(0);
      return;
    }
    
    setLoading(true);
    try {
      const startIndex = (pageNumber - 1) * 20;
      const { books: searchResults, totalItems: total } = await googleBooksService.searchBooks(query, startIndex);
      setBooks(searchResults);
      setTotalItems(total);
      setSearchParams({ q: query, page: pageNumber.toString() });
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('q');
    const pageParam = searchParams.get('page');
    if (query) {
      setSearchQuery(query);
      setPage(pageParam ? parseInt(pageParam) : 1);
      searchBooks(query, pageParam ? parseInt(pageParam) : 1);
    }
  }, [searchParams]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setHasSearched(true);
      searchBooks(searchQuery, 1);
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setBooks([]);
      setTotalItems(0);
      setHasSearched(false);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    searchBooks(searchQuery, value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
        position: 'relative',
        backgroundImage: 'url(/books-pattern.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => navigate('/home')}
          sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper
          component="form"
          onSubmit={handleSearch}
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.5)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for books..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton 
                    type="submit" 
                    sx={{ 
                      background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                        opacity: 0.9,
                      }
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(0,0,0,0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}

          />
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {books.length > 0 && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2, 
                  color: '#1a237e',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                {totalItems > books.length 
                  ? `Found ${books.length} exact ${books.length === 1 ? 'match' : 'matches'} (more available)`
                  : `Found ${books.length} exact ${books.length === 1 ? 'match' : 'matches'}`}
              </Typography>
            )}
            
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
                        <CardContent>
                        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 1 }}>
                          {book.volumeInfo.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          by {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                        </Typography>
                        {book.volumeInfo.categories && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {book.volumeInfo.categories[0]}
                          </Typography>
                        )}
                        {book.volumeInfo.description && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mt: 1,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {book.volumeInfo.description.replace(/<[^>]*>/g, '')}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </GridItem>
              ))}
            </Grid>

            {totalItems > books.length && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.min(Math.ceil(totalItems / 20), 3)} // Show max 3 pages initially
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        transform: 'scale(1.1)',
                      },
                      '&.Mui-selected': {
                        background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                          opacity: 0.9,
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}

            {!loading && searchQuery && books.length === 0 && (
              <Box textAlign="center" my={4}>
                <Typography variant="h6" sx={{ color: '#1a237e', textAlign: 'center' }}>
                  {hasSearched 
                    ? (
                      <>
                        No exact matches found for "{searchQuery}"<br/>
                        <Typography variant="body2" sx={{ mt: 1, color: '#5c6bc0' }}>
                          Try using fewer or more specific keywords
                        </Typography>
                      </>
                    )
                    : 'Click the search button or press Enter to search'}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Search;