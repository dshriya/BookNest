interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    settings?: {
      theme: string;
      language: string;
    };
  };
}

const API_URL = 'http://localhost:5000/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const token = data.token;

    // Fetch the complete user profile
    try {
      const profileResponse = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        // Use the complete profile data as the user data
        data.user = profileData;
      } else {
        console.error('Failed to fetch complete profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    const token = data.token;

    // Fetch the complete user profile after registration
    try {
      const profileResponse = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        // Use the complete profile data
        data.user = profileData;
      } else {
        console.error('Failed to fetch complete profile after registration');
      }
    } catch (error) {
      console.error('Error fetching profile after registration:', error);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async getUserSettings(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/users/settings`, {
      headers: {
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user settings');
    }

    return response.json();
  },

  async updateProfile(data: { username?: string; bio?: string; profilePicture?: string }): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      // If there's a profile picture, ensure it's properly formatted
      const requestData = { ...data };
      if (data.profilePicture) {
        // Check if it already has the data:image prefix
        if (!data.profilePicture.startsWith('data:image')) {
          requestData.profilePicture = `data:image/jpeg;base64,${data.profilePicture}`;
        }
      }

      console.log('Sending profile update request');
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile update failed:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Failed to update profile');
        } catch (e) {
          throw new Error(`Failed to update profile: ${errorText}`);
        }
      }

      const responseText = await response.text();
      console.log('Profile update response:', responseText);
      
      try {
        const updatedUser = JSON.parse(responseText);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  async uploadProfilePicture(file: File): Promise<string> {
    // In a real application, you would upload this to a cloud storage service
    // For now, we'll convert it to a base64 string
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async refreshUserProfile(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const userData = await response.json();
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }
  },

  async deleteAccount(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/users/delete-account`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete account');
    }

    // Clear local storage and redirect to login
    this.logout();
  },
};