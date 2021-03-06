import { useContext, useState } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");

    function handleUpdateText(event) {
        setText(event.target.value);
    }


    function saveList(){
        store.currentList.name = text;
        store.save();
    }

    function handlePublish(event, id){
        event.stopPropagation();
        store.currentList.name = text;
        store.publishList(id);
    }

    let editItems = "";
    let buttons = "";

    if(store.currentList && store.currentList.published == false){
        buttons =
        <Box  sx={{ pt: 40, pl: 160 }} >
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + store.currentList.id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onChange={handleUpdateText}
                defaultValue={store.currentList.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
        
        <Button 
        id='sort-menu'
        onClick={saveList}
        variant="contained">
            save
        </Button>
        <Button onClick={(event) => {
            handlePublish(event, store.currentList._id)
        }}
        variant="contained"
        >
            Publish
        </Button>
        </Box>;
    }

    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '70%', height: '20%', bgcolor: 'background.paper' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index} 
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="top5-workspace">
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
                {buttons}
            </div>
        </div>
    )
}

export default WorkspaceScreen;