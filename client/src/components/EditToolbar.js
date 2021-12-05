import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/HighlightOff';
import ScreenType from '../store'

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function saveList(){
        store.updateCurrentList();
    }

    function handleHome(){
        store.loadIdNamePairs("HOME");
    }

    function handleAll(){
        store.loadIdNamePairs("ALL");
    }

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
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
                onClick={handleHome}
                variant="contained">
                    home
            </Button>
            <Button 
                id='undo-button'
                onClick={handleAll}
                variant="contained">
                    All
            </Button>
            <Button 
                disabled={editStatus ? true : store.canUndo() ? false : true}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={editStatus ? true : store.canRedo() ? false : true}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button 
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                    <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;