import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { authService } from '../services/auth';

const Settings: React.FC = () => {
  const [user, setUser] = useState(authService.getUser());
  const [editMode, setEditMode] = useState<'username' | 'bio' | null>(null);
  const [tempUsername, setTempUsername] = useState(user?.username || '');
  const [tempBio, setTempBio] = useState(user?.bio || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const compressImage = async (file: File, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate new dimensions maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with 0.8 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      console.log('Starting profile picture upload');
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB for initial upload)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      setError(null);

      // Compress image before upload
      console.log('Compressing image...');
      const compressedImage = await compressImage(file);
      
      console.log('Updating profile with compressed image');
      // Update profile with compressed image
      const updatedUser = await authService.updateProfile({
        profilePicture: compressedImage
      });

      console.log('Profile update successful');
      setUser(updatedUser);
      setSuccessMessage('Profile picture updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Profile picture upload error:', err);
      setError(err.message || 'Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateUsername = async () => {
    try {
      if (!tempUsername.trim()) {
        setError('Username cannot be empty');
        return;
      }

      const updatedUser = await authService.updateProfile({
        username: tempUsername.trim()
      });

      setUser(updatedUser);
      setEditMode(null);
      setSuccessMessage('Username updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update username');
    }
  };

  const handleUpdateBio = async () => {
    try {
      const updatedUser = await authService.updateProfile({
        bio: tempBio.trim()
      });

      setUser(updatedUser);
      setEditMode(null);
      setSuccessMessage('Bio updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update bio');
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      await authService.changePassword(currentPassword, newPassword);
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccessMessage('Password changed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      // The authService will handle the logout and redirect
    } catch (err) {
      setError('Failed to delete account');
      setShowDeleteDialog(false);
    }
  };

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
      <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(211, 47, 47, 0.9)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(46, 125, 50, 0.9)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}

        {/* Profile Section */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar
                src={user?.profilePicture}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#64b5f6',
                  fontSize: '3rem',
                  border: '4px solid white',
                  boxShadow: '0 4px 14px rgba(100, 181, 246, 0.2)',
                }}
              >
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                aria-label="upload picture"
                component="label"
                disabled={isUploading}
              >
                <input
                  hidden
                  accept="image/jpeg,image/png,image/gif"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleProfilePictureUpload(file);
                    }
                  }}
                />
                {isUploading ? (
                  <CircularProgress size={24} sx={{ color: '#64b5f6' }} />
                ) : (
                  <PhotoCameraIcon />
                )}
              </IconButton>
            </Box>

            <Box sx={{ width: '100%', textAlign: 'center' }}>
              {editMode === 'username' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <TextField
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    size="small"
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#64b5f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#42a5f5',
                        },
                      },
                    }}
                  />
                  <Button
                    onClick={handleUpdateUsername}
                    sx={{
                      bgcolor: '#64b5f6',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#42a5f5',
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditMode(null)}
                    sx={{
                      color: '#64b5f6',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 181, 246, 0.08)',
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  {user?.username}
                  <IconButton size="small" onClick={() => setEditMode('username')} sx={{ color: '#64b5f6' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Typography>
              )}

              {editMode === 'bio' ? (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#64b5f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#42a5f5',
                        },
                      },
                    }}
                  />
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      onClick={handleUpdateBio}
                      sx={{
                        bgcolor: '#64b5f6',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#42a5f5',
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditMode(null)}
                      sx={{
                        color: '#64b5f6',
                        '&:hover': {
                          backgroundColor: 'rgba(100, 181, 246, 0.08)',
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    {user?.bio || 'No bio yet'}
                  </Typography>
                  <IconButton size="small" onClick={() => setEditMode('bio')} sx={{ color: '#64b5f6' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Account Settings Section */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1">Email Address</Typography>
              <Typography color="text.secondary">{user?.email}</Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Password</Typography>
              <Button
                onClick={() => setShowPasswordDialog(true)}
                sx={{
                  bgcolor: '#64b5f6',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#42a5f5',
                  }
                }}
              >
                Change Password
              </Button>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" color="error">
                Delete Account
              </Typography>
              <Button
                color="error"
                variant="contained"
                onClick={() => setShowDeleteDialog(true)}
                sx={{
                  backgroundColor: 'rgb(211, 47, 47)',
                  '&:hover': {
                    backgroundColor: 'rgb(181, 17, 17)',
                  }
                }}
              >
                Delete Account
              </Button>
            </Box>
          </Stack>
        </Paper>

        {/* Password Change Dialog */}
        <Dialog
          open={showPasswordDialog}
          onClose={() => {
            setShowPasswordDialog(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              width: '400px'
            }
          }}
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#64b5f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#42a5f5',
                    },
                  },
                }}
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#64b5f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#42a5f5',
                    },
                  },
                }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#64b5f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#42a5f5',
                    },
                  },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowPasswordDialog(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              sx={{
                color: '#64b5f6',
                '&:hover': {
                  backgroundColor: 'rgba(100, 181, 246, 0.08)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordReset}
              disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              sx={{
                bgcolor: '#64b5f6',
                color: 'white',
                '&:hover': {
                  bgcolor: '#42a5f5',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(100, 181, 246, 0.3)',
                }
              }}
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }
          }}
        >
          <DialogTitle sx={{ color: 'error.main' }}>Delete Account</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your account? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              sx={{
                color: '#64b5f6',
                '&:hover': {
                  backgroundColor: 'rgba(100, 181, 246, 0.08)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              sx={{
                backgroundColor: 'rgb(211, 47, 47)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgb(181, 17, 17)',
                }
              }}
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Settings;