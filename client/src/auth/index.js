import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import ErrorModal from '../components/ErrorModal'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    ERROR:"ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        message: ""
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    message: ""
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    message: ""
                });
            }
            case AuthActionType.LOG_OUT:{
                return setAuth({
                    user: null,
                    loggedIn: false,
                    message: ""
                });
            }
            case AuthActionType.ERROR:{
                return setAuth({
                    user: null,
                    loggedIn: false,
                    message: payload.message
                });
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.logoutUser = async function() {
        authReducer({
            type: AuthActionType.LOG_OUT,
            payload: {

            }
        });
    }

    auth.logInUser = async function(userData, store) {  
        try {
            const response = await api.loginUser(userData);  
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }
        catch(err){
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    message: err.response.data.errorMessage
                }
            })
        }
    }

    auth.registerUser = async function(userData, store) {
        const response = await api.registerUser(userData);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }
    

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
            <ErrorModal 
            error = {auth.message}
            logout = {auth.logout}
            />
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };