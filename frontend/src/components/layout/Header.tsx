import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookRounded from '@mui/icons-material/MenuBookRounded';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = authService.getUser();

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '0 0 16px 16px',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={() => navigate('/home')}
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: (theme: any) => theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          <MenuBookRounded sx={{ fontSize: 28 }} />
          BookNest
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/library')}
            aria-label="my nest"
            sx={{ 
              borderRadius: 3,
              transition: 'all 0.2s',
              '&:hover': {
                color: theme => theme.palette.primary.main,
                transform: 'scale(1.1)',
              }
            }}
          >
            <MenuBookRounded sx={{ fontSize: 28 }} />
          </IconButton>

          <IconButton
            onClick={handleSettingsClick}
            color="inherit"
            edge="end"
            aria-label="settings"
            sx={{ 
              borderRadius: 3,
              p: 0.5
            }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3)',
                },
                bgcolor: '#64b5f6',
              }}
              src={user?.profilePicture}  // Fixed property name to match user object
              imgProps={{
                style: {
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              width: 200,
              maxWidth: '100%',
              mt: 1.5,
              borderRadius: 4,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;