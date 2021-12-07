import { useContext, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/HighlightOff';
import TextField from '@mui/material/TextField';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editActive, setEditActive] = useState(false);
    const isMenuOpen = Boolean(anchorEl);

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.search(event.target.value);
        }
    }

    const searchBar = 
        <TextField
        margin="normal"
        required
        id={"searchBar"}
        label="enter search term"
        name="name"
        autoComplete="Top 5 Item Name"
        className='search'
        onKeyPress={handleKeyPress}
        defaultValue=""
        inputProps={{style: {fontSize: 48}}}
        InputLabelProps={{style: {fontSize: 24}}}
        autoFocus
    />

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = "sort-menu"
    const sortMenu = 
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
            <MenuItem onClick={handleSortViews}>Views</MenuItem>
            <MenuItem onClick={handleSortLikes}>Likes</MenuItem>
            <MenuItem onClick={handleSortDislikes}>Dislikes</MenuItem>
            <MenuItem onClick={handleSortNew}>Date (New)</MenuItem>
            <MenuItem onClick={handleSortOld}>Date (Old)</MenuItem>
        </Menu>        

    function handleSortViews(){
        store.sortLists("VIEWS");
    }

    function handleSortLikes(){
        store.sortLists("LIKES");
    }

    function handleSortDislikes(){
        store.sortLists("DISLIKES");
    }

    function handleSortNew(){
        store.sortLists("DATE_NEW");
    }

    function handleSortOld(){
        store.sortLists("DATE_OLD");
    }


    function handleHome(){
        store.loadIdNamePairs("HOME");
    }

    function handleAll(){
        store.loadIdNamePairs("ALL");
    }

    function handleCommunity(){
        store.loadIdNamePairs("COMMUNITY");
    }

    function handleUser(){
        console.log("user0");
        store.loadIdNamePairs("USER");
    }

    function handleClose() {
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.isListNameEditActive || store.isItemEditActive) {
        editStatus = true;
    }  
    return (
        <div id="edit-toolbar">
            <Button 
                id='undo-button'
                disabled = {store.screen == "HOME" ? true : false}
                onClick={handleHome}
                variant="contained">
                    home
            </Button>
            <Button 
                id='undo-button'
                disabled = {store.screen == "ALL" ? true : false}
                onClick={handleAll}
                variant="contained">
                    All
            </Button>
            <Button 
                id='undo-button'
                disabled = {store.screen == "COMMUNITY" ? true : false}
                onClick={handleCommunity}
                variant="contained">
                    Community
            </Button>
            <Button 
                id='undo-button'
                disabled = {store.screen == "USER" ? true : false}
                onClick={handleUser}
                variant="contained">
                    User
            </Button>

            {searchBar}
            <Button 
                id='sort-menu'
                onClick={handleProfileMenuOpen}
                variant="contained">
                    sort
            </Button>
            {sortMenu}
        </div>
    )
}

export default EditToolbar;