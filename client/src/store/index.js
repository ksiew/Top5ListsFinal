import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'
import DeleteModal from '../components/DeleteModal'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    RELOAD: "RELOAD",
    CHANGE_SCREEN: "CHANGE_SCREEN"
}

export const ScreenType ={
    HOME : "HOME",
    USERS: "USERS",
    COMMUNITY: "COMMUNITY",
    ALL: "ALL"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();


// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        loadModal: false,
        screen: ScreenType.HOME,
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen
                });
            }

            
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: payload.screen
                });
            }

            case GlobalStoreActionType.CHANGE_SCREEN: {
                let test = payload;
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: payload.screen
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    loadModal: true,
                    screen: store.screen
                });
            }

            //reload page when listCard is updated
            case GlobalStoreActionType.RELOAD: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen
                });
            }

            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    loadModal: false,
                    screen: store.screen
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    async function getListPairs(top5List) {
                        response = await api.getTop5ListPairs();
                        if (response.data.success) {
                            if(store.screen == ScreenType.HOME){
                                let fuck = await api.getAllTop5Lists();
                                let fuck2 = [];
                                fuck.data.data.forEach(list => fuck2[list._id] = list);
                                let pairsArray = response.data.idNamePairs.filter(pair => fuck2[pair._id].ownerEmail == auth.user.email);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                    }
                    getListPairs(top5List);
                }
            }
            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            ownerEmail: auth.user.email
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    //this function publishes the selected list
    store.publishList = async function(id){
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let list = response.data.top5List;
            list.published = true;
            //list.publishDate = new Date();
            list.publishDate = 2;

            response = await api.updateTop5ListById(list._id, list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.RELOAD,
                });
            }
        }
    }

    //this function adds a comment to a published list
    store.addComment = async function (id, comment){
        let response = await api.getTop5ListById(id);
        if(response.data.success){
            let list = response.data.top5List;
            list.comments.push(comment);
            response = await api.updateTop5ListById(list._id,list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.RELOAD,
                });
            }
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function (screen) {
        let response = await api.getTop5ListPairs();

        if (response.data.success) {
            let fuck = await api.getAllTop5Lists();
            if(screen != ScreenType.COMMUNITY){
                fuck.data.data.forEach(list => (list.ownerEmail == "community") ? store.deleteList(list) : null);
                fuck = await api.getAllTop5Lists();
            }


            let fuck2 = [];

            //sets fuck 2 to an array with list id a skey with the list itself as the valuie
            fuck.data.data.forEach(list => fuck2[list._id] = list);

            let pairs = response.data.idNamePairs.filter(pair => fuck2[pair._id].published == true);


            if(screen == ScreenType.HOME){
                let pairsArray = response.data.idNamePairs.filter(pair => fuck2[pair._id].ownerEmail == auth.user.email);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        screen: ScreenType.HOME,
                        idNamePairs: pairsArray
                    }
                });
            }

            let publishedLists = [];
            fuck.data.data.forEach(list => (list.published == true) ? publishedLists[list._id] = list : null);


            if(screen == ScreenType.ALL){
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        screen: ScreenType.ALL,
                        idNamePairs: pairs
                    }
                });
            }
            if(screen == ScreenType.COMMUNITY){
                // a list with all the unique list names as keys and their items as the value
                let aggregate = [];

                //takes an array of top5lists and a list name to return the top5 voted items
                async function findTop5(lists, name){
                    let filteredLists = [];
                    for(var i in lists){
                        let list = lists[i];
                        if(list.name == name) filteredLists.push(list);
                    }
                    let top5 = [];
                    for(var i in filteredLists){
                        let list = filteredLists[i];
                        top5[list.items[0]] = top5[list.items[0]] ? top5[list.items[0]] + 5 : 5;
                        top5[list.items[1]] = top5[list.items[1]] ? top5[list.items[1]] + 4 : 4;
                        top5[list.items[2]] = top5[list.items[2]] ? top5[list.items[2]] + 3 : 3;
                        top5[list.items[3]] = top5[list.items[3]] ? top5[list.items[3]] + 2 : 2;
                        top5[list.items[4]] = top5[list.items[4]] ? top5[list.items[4]] + 1 : 1;
                    }
                    let top5Lists = [];
                    for(var i = 0; i < 5; i ++){
                        let max = 0;
                        let maxName ="";
                        for(var listName in top5){
                            if(!top5Lists.includes(listName) && top5[listName] > max){
                                maxName = listName;
                            }
                        }
                        top5Lists[i] = maxName;
                        top5.splice(maxName, 1);
                    }

                    let payload = {
                        name: "Community " + name,
                        items: top5Lists,
                        ownerEmail: "community",
                        published: true,
                        publishDate: 2

                    };

                    const response2 = await api.createTop5List(payload);
                    if(response2.data.success){
                        return response2.data.top5List;
                    }else{
                        return "error"
                    }
                }

                let temp = [];
                for(let i = 0; i < pairs.length; i ++){
                    temp.push(pairs[i].name);
                }

                let uniqueNames = new Set(temp);
                let communityLists = [];
                uniqueNames.forEach(name => communityLists.push(findTop5(publishedLists, name)));
                fuck = await api.getAllTop5Lists();
                response = await api.getTop5ListPairs();

                
                fuck.data.data.forEach(list => fuck2[list._id] = list);
                fuck.data.data.forEach(list => communityLists[list._id] = list);


                communityLists =  response.data.idNamePairs.filter(pair => pair.name.substring(0,9) == "Community");



                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        screen: ScreenType.COMMUNITY,
                        idNamePairs: communityLists
                    }
                });

            }

        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
          
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }

    }

    store.hideDeleteListModal = function (){
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,

        });
    }


    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadIdNamePairs(ScreenType.HOME);
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            if(top5List.published == true) top5List.views = top5List.views + 1

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
                history.push("/top5list/" + top5List._id);
            }
        }
    }

    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addUpdateItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    store.updateItem = function (index, newItem) {

        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    store.likeList = async function(id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            let email = auth.user.email;
            if(top5List.likes.includes(email)){
                top5List.likes.splice(top5List.likes.indexOf(email),1);
            }else{
                top5List.dislikes.splice(top5List.dislikes.indexOf(email),1);
                top5List.likes.push(email);
            }

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.RELOAD,
                });
            }
        }
    }

    store.dislikeList = async function(id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            let email = auth.user.email;
            if(top5List.dislikes.includes(email)){
                top5List.dislikes.splice(top5List.dislikes.indexOf(email),1);
            }else{
                top5List.likes.splice(top5List.likes.indexOf(email),1);
                top5List.dislikes.push(email);
            }
            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.RELOAD,
                });
            }
        }
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    store.canUndo = function() {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function() {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
            <DeleteModal 
            open = {store.loadModal}
            delete = {store.deleteMarkedList}
            message = {store.listMarkedForDeletion ? store.listMarkedForDeletion.name : null}
            close = {store.hideDeleteListModal}
            />
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };