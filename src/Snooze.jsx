import { ArrowDropDown, ChevronRight, KeyboardArrowLeft, MoreVert, Refresh } from '@mui/icons-material'
import { Box, Checkbox, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material'
import React from 'react';
import './common.css';

function LinearProgressWithLabel(props) {
    return (
        <Box className='memory__used'>
            <Box>
                <LinearProgress variant="determinate" {...props} className='memory__used__progress' />
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" className='memory__used__text'>3.2 GB of 15 GB used</Typography>
            </Box>
        </Box>
    );
}

const Snooze = () => {
    return (
        <div className='emailList'>
            <div className="emailList__settings">
                <div className="emailList__settingsLeft">
                    <Tooltip title="Select">
                        <IconButton >
                            <Checkbox />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Select">
                        <IconButton >
                            <ArrowDropDown className='emailList__select__downarrow' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh">
                        <IconButton >
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="More">
                        <IconButton >
                            <MoreVert />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="emailList__settingsRight">
                    <p>0-0 of 0</p>
                    <Tooltip title="Newer">
                        <IconButton >
                            <KeyboardArrowLeft />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Older">
                        <IconButton >
                            <ChevronRight />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="message">
            No messages matched your search. You can broaden your search to look in "Mail & Spam & Bin".
            </div>
            <div className="footer">
                <Box sx={{ width: '15vw' }}>
                    <LinearProgressWithLabel value={25} />
                </Box>
                <div className="footer__middle">
                    Terms · Privacy · Programme Policies
                </div>
                <div className="footer__right">
                    Last account activity: 19 hours ago Details
                </div>
            </div>
        </div>
    )
}

export default Snooze