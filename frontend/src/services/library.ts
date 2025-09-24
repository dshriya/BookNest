import { GoogleBookResponse } from './googleBooks';

interface LibraryResponse {
  success: boolean;
  message: string;
}

interface LibraryBook {
  bookId: string;
  isLiked: boolean;
  inNest: boolean;
  addedAt: Date;
  userId: string;
}

class LibraryService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Get library status for a book
  async getBookStatus(bookId: string): Promise<LibraryBook | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${this.API_URL}/api/library/status/${bookId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
      });

      if (!response.ok) throw new Error('Failed to get book status');

      return await response.json();
    } catch (error) {
      console.error('Error getting book status:', error);
      return null;
    }
  }

  // Toggle like status
  async toggleLike(book: GoogleBookResponse): Promise<LibraryResponse> {
    try {
      console.log('Sending like request for book:', book.id);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${this.API_URL}/api/library/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          bookId: book.id,
          volumeInfo: book.volumeInfo,
        }),
      });

      console.log('Like response status:', response.status);
      const data = await response.json();
      console.log('Like response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle like status');
      }

      return data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Toggle nest (library) status
  async toggleNest(book: GoogleBookResponse): Promise<LibraryResponse> {
    try {
      console.log('Sending nest request for book:', book.id);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${this.API_URL}/api/library/nest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          bookId: book.id,
          volumeInfo: book.volumeInfo,
        }),
      });

      console.log('Nest response status:', response.status);
      const data = await response.json();
      console.log('Nest response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle nest status');
      }

      return data;
    } catch (error) {
      console.error('Error toggling nest status:', error);
      throw error;
    }
  }

  // Get all liked books
  async getLikedBooks(): Promise<GoogleBookResponse[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${this.API_URL}/api/library/liked`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
      });

      if (!response.ok) throw new Error('Failed to get liked books');

      return await response.json();
    } catch (error) {
      console.error('Error getting liked books:', error);
      return [];
    }
  }

  // Get all books in nest (library)
  async getNestBooks(): Promise<GoogleBookResponse[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${this.API_URL}/api/library/nest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
      });

      if (!response.ok) throw new Error('Failed to get nest books');

      return await response.json();
    } catch (error) {
      console.error('Error getting nest books:', error);
      return [];
    }
  }
}

export const libraryService = new LibraryService();