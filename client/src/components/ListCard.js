import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspaceScreen from './WorkspaceScreen';
import AuthContext from '../auth'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair } = props;
    const[isOpen, setOpen] = useState(false);

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleOpen(event){
        event.stopPropagation();
        setOpen(!isOpen);
    }

    function handleToggleList(event, id) {
        event.stopPropagation();
        if(store.currentList !== null && store.currentList._id === id){
            store.closeCurrentList();
        }else{
            store.setCurrentList(id);
        }
    }

    function handleLike(event, id){
        event.stopPropagation();
        store.likeList(id);
    }

    function handleDislike(event, id){
        event.stopPropagation();
        store.dislikeList(id);
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function handlePublish(event, id){
        event.stopPropagation();
        store.publishList(id);
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    
    function handleKeyPressComment(event) {
        if (event.code === "Enter") {
            store.addComment(idNamePair._id, event.target.value);
            setText("");
        }
    }

    let listHeight = 120;
    let padding = 0;
    let top5Items = "";

    const commentBar = 
        <TextField
        margin="normal"
        required
        id={"searchBar"}
        label="enter comment"
        name="name"
        autoComplete="Top 5 Item Name"
        className='search'
        onKeyPress={handleKeyPressComment}
        defaultValue=""
        inputProps={{style: {fontSize: 24}}}
        InputLabelProps={{style: {fontSize: 24}}}
        autoFocus
    />



    if(store.currentList != null && store.currentList._id == idNamePair._id){
        let comments =
        <List sx={{ width: '40%', right: '5%', bgcolor: 'background.paper' }}>
        {
           store.currentList.comments.map((pair) => (
                <ListItem>
                        {pair }
                </ListItem>
            ))
        }
        </List>;


        padding = '10%';
        listHeight = 600;
        top5Items =
        <Box 
        fullwidth
        sx={{ height: 10, width: '50%',pt: 0, pr:0,  flexGrow: 1,bgcolor: 'background.paper' }}>
            <WorkspaceScreen  sx={{ height: 10, width: '50%',pt: 0, pr:0,  flexGrow: 1,bgcolor: 'background.paper' }}>

            </WorkspaceScreen>
            {commentBar}
            {comments}
        </Box>
    }

    let cardElement = "";
    let owned = false;
    if(auth.user.email == idNamePair.ownerEmail) owned = true

    cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id} 
            sx={{ marginTop: '15px', display: 'flex', p: 1, flexGrow: 20}}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }
            }
            style={{
                fontSize: '48pt',
                width: '100%'
            }}
        >
                <Box sx={{ p: 1, pb: padding,  flexGrow: 1 }}>{idNamePair.name}</Box>
            
                <Box sx={{ p: 1 , pb: padding}}>
                    <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                        <DeleteIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
                {top5Items}
                <Box sx={{ p: 1 , pt: padding}}>
                    <IconButton onClick={(event) => {
                        handleToggleList(event, idNamePair._id)
                    }}>
                    <KeyboardArrowDownIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
        </ListItem>
    if(idNamePair.published){
        let publishInfo = "published by: " + idNamePair.ownerName + " on: " + idNamePair.publishDate + "  ";
        let viewInfo = "Views: " + idNamePair.views;

        cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id} 
            sx={{height: listHeight, marginTop: '15px', display: 'flex', p: 10}}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }
            }
            style={{
                fontSize: '28pt',
                width: '100%'
            }}
        >
                <Box sx={{ p: 1, flexGrow: 1, top: '90%',  pb: padding}}>{idNamePair.name}</Box>
                
                <Box sx={{ p: 1 , pb: padding}}>
                    <IconButton onClick={(event) => {
                        handleLike(event, idNamePair._id)
                    }}>
                        <ThumbUpIcon style={{fontSize:'24pt'}} />
                        {idNamePair.likes.length}
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 , pb: padding}}>
                    <IconButton onClick={(event) => {
                        handleDislike(event, idNamePair._id)
                    }}>
                    <ThumbDownIcon style={{fontSize:'24pt'}} />
                    {idNamePair.dislikes.length}
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 , pb: padding}}>
                    <IconButton 
                    disabled={!owned}
                    onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                        <DeleteIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
            {top5Items}
                <Box sx={{ p: 1 , pb: padding}}>
                    <IconButton onClick={(event) => {
                        handleToggleList(event, idNamePair._id)
                    }}>
                                            <KeyboardArrowDownIcon style={{fontSize:'48pt'}} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 , pb: padding}}>
                    {publishInfo}
                    {viewInfo}
                    </Box>
        </ListItem>
    }

    

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;