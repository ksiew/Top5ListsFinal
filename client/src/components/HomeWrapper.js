import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import EditToolbar from './EditToolbar'
import Box from '@mui/material/Box';

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    let editToolbar = <EditToolbar sx={{ py:2 }}/>;
    
    if (auth.loggedIn)
        return( 
            <Box sx={{ bgcolor: 'white' }}>
                {editToolbar}
            <HomeScreen sx={{ bgcolor: 'white' }}>

            </HomeScreen>
        </Box>)
    else
        return <SplashScreen />
}