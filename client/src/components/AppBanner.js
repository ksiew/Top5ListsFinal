import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import EditToolbar from './EditToolbar'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleGuest = () => {
        auth.logInUser({ 
            userName: "Guest",
            password: "K!u7Q3vXKg3L36!",
          }, store);
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Box
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
        
        </Box>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let buttons = 
    (<Box>
            <Button onClick={handleMenuClose}><Link to='/logIn/'>Log In</Link></Button>
            <Button onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></Button>
            <Button onClick={handleGuest}><Link to='/register/'>Guest Log In</Link></Button>
    </Box>);

    let intials = "";
    let editToolbar = <EditToolbar />;
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        buttons = "";
        intials = auth.user.firstName.charAt(0) + auth.user.lastName.charAt(0);
        menu = loggedInMenu;
    }
    
    function getAccountMenu(loggedIn) {
        return <AccountCircle />;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}                        
                    >
                        <Link style={{ textDecoration: 'none', color: 'white' }} to='/'>T<sup>5</sup>L</Link>
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}> 
                    <Box 
                    sx={{ flexGrow: 1, px: 70}}
                    style={{
                        fontSize: '24pt',
                        width: '80%'
                    }}>{intials}</Box>
                        {buttons};
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
                {
                menu
            }
            </AppBar>
        </Box>
    );
}