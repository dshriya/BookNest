/**
 * Types and interfaces for the Google Books service.
 * Contains book response types and service methods for fetching and managing books.
 */
export interface GoogleBookResponse {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
  saleInfo?: {
    country?: string;
    saleability?: string;
    isEbook?: boolean;
  };
  accessInfo?: {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    textToSpeechPermission?: string;
    epub?: {
      isAvailable?: boolean;
      downloadLink?: string;
    };
    pdf?: {
      isAvailable?: boolean;
      downloadLink?: string;
    };
    webReaderLink?: string;
    accessViewStatus?: string;
  };
}



const POPULAR_BOOKS: GoogleBookResponse[] = [
  {
    id: 'wrOQLV6xB-wC',
    volumeInfo: {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      authors: ['J.K. Rowling'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Fiction']
    }
  },
  {
    id: 'iAblDwAAQBAJ',
    volumeInfo: {
      title: 'Dune',
      authors: ['Frank Herbert'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=iAblDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Science Fiction']
    }
  },
  {
    id: 'QVn-CgAAQBAJ',
    volumeInfo: {
      title: 'The Way of Kings',
      authors: ['Brandon Sanderson'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=QVn-CgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Fantasy']
    }
  },
  {
    id: 'itoREAAAQBAJ',
    volumeInfo: {
      title: 'Project Hail Mary',
      authors: ['Andy Weir'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=itoREAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Science Fiction']
    }
  },
  {
    id: 'XWB2DwAAQBAJ',
    volumeInfo: {
      title: 'Beach Read',
      authors: ['Emily Henry'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=XWB2DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Romance']
    }
  },
  {
    id: 'ZrNzAwAAQBAJ',
    volumeInfo: {
      title: 'The Girl on the Train',
      authors: ['Paula Hawkins'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=ZrNzAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Mystery']
    }
  },
  {
    id: 'lGjFtMRqp_YC',
    volumeInfo: {
      title: 'Twilight',
      authors: ['Stephenie Meyer'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=lGjFtMRqp_YC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Young Adult Fiction']
    }
  },
  {
    id: '2WsnLilhMYkC',
    volumeInfo: {
      title: 'Bhagavad Gita',
      authors: ['Anonymous'],
      imageLinks: {
        thumbnail: 'https://books.google.com/books/content?id=2WsnLilhMYkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      categories: ['Religion']
    }
  }
];

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1';

export const googleBooksService = {
  getValidImageUrl: (book: GoogleBookResponse): string => {
    // Check if the book has image links
    if (!book.volumeInfo?.imageLinks?.thumbnail) {
      return '/book-covers/default-cover.jpg';
    }

    const thumbnail = book.volumeInfo.imageLinks.thumbnail;
    
    // Check if the URL has the required parameters that indicate a real image
    if (!thumbnail.includes('edge=curl') || !thumbnail.includes('source=gbs_api')) {
      return '/book-covers/default-cover.jpg';
    }

    // Convert to HTTPS and ensure proper parameters
    const secureUrl = thumbnail
      .replace('http://', 'https://')
      .replace('zoom=1', 'zoom=2');

    return secureUrl;
  },

  getPopularBooks: (): Promise<GoogleBookResponse[]> => {
    return Promise.resolve(POPULAR_BOOKS);
  },

  searchBooks: async (query: string, startIndex: number = 0): Promise<{ books: GoogleBookResponse[], totalItems: number }> => {
    try {
      // Add exact word matching and filter by title/author
      const formattedQuery = query.split(' ')
        .map(word => `"${word}"`) // Exact word matching
        .join(' ');
      
      // First, get total results without filtering
      const initialResponse = await fetch(
        `${GOOGLE_BOOKS_API_URL}/volumes?q=${encodeURIComponent(formattedQuery)}&maxResults=1&orderBy=relevance&printType=books&filter=ebooks`
      );
      const initialData = await initialResponse.json();
      const totalApiResults = Math.min(initialData.totalItems || 0, 200); // Limit to 200 items total

      // Then get the current page
      const response = await fetch(
        `${GOOGLE_BOOKS_API_URL}/volumes?q=${encodeURIComponent(formattedQuery)}&startIndex=${startIndex}&maxResults=20&orderBy=relevance&printType=books&filter=ebooks`
      );
      const data = await response.json();
      
      // Filter results to ensure they actually match the search terms
      const searchTerms = query.toLowerCase().split(/\s+/);
      const filteredBooks = (data.items || []).filter((book: GoogleBookResponse) => {
        const title = book.volumeInfo.title?.toLowerCase() || '';
        const authors = book.volumeInfo.authors?.join(' ').toLowerCase() || '';
        
        // Check if all search terms appear in either title or authors
        return searchTerms.every(term => 
          title.includes(term) || authors.includes(term)
        );
      });

      // If this page has fewer than 20 results after filtering,
      // we know there aren't any more pages
      const hasMorePages = data.items?.length === 20 && filteredBooks.length >= 10;
      
      return {
        books: filteredBooks,
        totalItems: hasMorePages ? Math.max(40, filteredBooks.length) : filteredBooks.length
      };
    } catch (error) {
      console.error('Error searching books:', error);
      return { books: [], totalItems: 0 };
    }
  },

  getBookDetails: async (bookId: string): Promise<GoogleBookResponse | null> => {
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API_URL}/volumes/${bookId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  }
};