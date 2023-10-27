import React from 'react';
import './SidebarOption.css';
import { Tooltip } from '@mui/material';
import { NavLink } from 'react-router-dom';

const SidebarOption = ({ Icon, title, number, tab, tooltip }) => {
    return (
        <NavLink to={tab} style={{ textDecoration: "none" }} exact="true" activeclassname="active">
            <Tooltip title={tooltip} placement='right'>
                <div className="sidebarOption">
                    <Icon />
                    <h3>{title}</h3>
                    {number && <p>{number}</p>}
                </div>
            </Tooltip>
        </NavLink>
    )
}

export default SidebarOption