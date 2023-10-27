import React from 'react';
import moment from 'moment';
import './EmailRow.css';
import { Checkbox, IconButton, Tooltip } from '@mui/material';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import { collection, updateDoc, doc } from 'firebase/firestore';
import { ArchiveOutlined, DeleteOutlineOutlined, DraftsOutlined, QueryBuilderOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import db from './config/firebase';

const EmailRow = ({ id, title, subject, description, createdAt, isSeen, isStarred, fetchData, isSelected, handleSelected, getCollectionName, deleteEmail, emailReadUnreadToggle }) => {
    const navigate = useNavigate();

    const toggleStarred = async (e) => {
        e.stopPropagation();
        let collectionName = getCollectionName();
        const collectionRef = collection(db, collectionName);
        await updateDoc(doc(collectionRef, id), { isStarred: !isStarred });
        fetchData();
    }

    return (
        <div className={`emailRow ${isSeen ? "seen__email" : ""}  ${isSelected ? "selected__email" : ""}`} onClick={() => navigate(`/inbox/mail/${id}`)}>
            <div className="emailRow__options">
                <Tooltip title="Select">
                    <Checkbox checked={isSelected} onChange={() => { handleSelected(id); }} onClick={(e) => e.stopPropagation()} />
                </Tooltip>
                {isStarred ?
                    <Tooltip title="Starred" onClick={toggleStarred}>
                        <StarIcon className="starred__email" />
                    </Tooltip> :
                    <Tooltip title="Not starred" onClick={toggleStarred}>
                        <StarBorderOutlinedIcon />
                    </Tooltip>}
            </div>
            <div className="emailRow__title">
                <h3 className={`${isSeen ? "seen__email" : ""} ${isSelected ? "selected__email" : ""}`}>{title}</h3>
            </div>
            <div className="emailRow__message">
                <h4 className={`${isSeen ? "seen__email" : ""} ${isSelected ? "selected__email" : ""}`}>{subject} - <span className='emailRow__description'>{description}</span></h4>
            </div>
            <div className={`emailRow__time ${isSeen ? "seen__email" : ""} ${isSelected ? "selected__email" : ""}`}>
                {moment(createdAt).format("DD MM YYYY") === moment().format("DD MM YYYY") ? moment(createdAt).format('HH:mm') : moment(createdAt).format('DD MMM')}
            </div>
            <div className="emailRow__actions">
                <Tooltip title="Archive" onClick={(e) => { e.stopPropagation(); deleteEmail(id); toast.success('Conversation archieved'); }} >
                    <IconButton >
                        <ArchiveOutlined />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" onClick={(e) => { e.stopPropagation(); deleteEmail(id); toast.success('Conversation moved to bin'); }} >
                    <IconButton >
                        <DeleteOutlineOutlined />
                    </IconButton>
                </Tooltip>
                <Tooltip title={isSeen ? "Mark as unread" : "Mark as read"} onClick={(e) => { e.stopPropagation(); emailReadUnreadToggle(id, isSeen); toast.success(`Conversation marked as ${isSeen ? "unread" : "read"}`); }} >
                    <IconButton >
                        <DraftsOutlined />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Snooze" onClick={(e) => e.stopPropagation()} >
                    <IconButton >
                        <QueryBuilderOutlined />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

export default EmailRow;