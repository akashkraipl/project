import React from 'react';
import './Header.css';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

const Header = () => {
    return (
        <div className='header'>
            <div className="header__left">
                <Tooltip title="Main Menu">
                    <IconButton >
                        <MenuIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Gmail">
                    <img src="/images/gmail_logo.png" alt="gmail logo" />
                </Tooltip>
            </div>
            <div className="header__middle">
                <Tooltip title="Search">
                    <IconButton >
                        <SearchOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <input type="text" placeholder='Search mail' className='header__inputCaret' />
                <Tooltip title="Show search options">
                    <IconButton >
                        <TuneOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div className="header__right">
                <Tooltip title="Support">
                    <IconButton >
                        <HelpOutlineIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                    <IconButton >
                        <SettingsOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Google apps">
                    <IconButton >
                        <AppsOutlinedIcon />
                    </IconButton >
                </Tooltip>
                <Tooltip title="Google Account">
                    <Avatar src='/images/logo.png' className='logo' alt='user logo' />
                </Tooltip>
            </div>
        </div>
    )
}

export default Header