import React, { useEffect, useState } from 'react';
import './EmailList.css';
import { Checkbox, IconButton, Tooltip, LinearProgress, Typography, Box, MenuItem, Menu, CircularProgress } from '@mui/material';
import { ArrowDropDown, KeyboardArrowLeft, ChevronRight, PhotoOutlined, LocalOfferOutlined, GroupOutlined, ArchiveOutlined, ReportGmailerrorredOutlined, DeleteOutlineOutlined, DraftsOutlined, AccessTimeOutlined, AddTaskOutlined, DriveFileMoveOutlined, LabelOutlined, Refresh, MoreVert } from '@mui/icons-material';
import { collection, getDocs, orderBy, limit, deleteDoc, doc, updateDoc, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Section from './Section';
import EmailRow from './EmailRow';
import db from './config/firebase';

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

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired
};

const EmailList = () => {
    const [emailList, setEmailList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [anchorEl, setAnchorEl] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [tab, setTab] = useState(1);

    useEffect(() => {
        fetchData();
        document.title = "Inbox - akashkr.aipl@gmail.com";

        // const intervalId = setInterval(() => {
        //     fetchData();
        // }, 2000);

        // return () => {
        //     clearInterval(intervalId);
        // };
        // eslint-disable-next-line
    }, [tab])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(false);
    };

    const getCollectionName = () => {
        if (tab === 1) return "primary-email";
        else if (tab === 2) return "promotions-email";
        else if (tab === 3) return "social-email";
    }

    const fetchData = async () => {
        try {
            let emailRecords = [];
            setLoader(true);
            let collectionName = getCollectionName();
            const querySnapshot = await getDocs(query(collection(db, collectionName), orderBy('createdAt', 'desc'), limit(20)));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                emailRecords.push({ id: doc.id, ...data });
            });
            setEmailList(emailRecords);
            setLoader(false);
        } catch (error) {
            console.error('Error getting documents: ', error);
            setLoader(false);
            toast.error('Something went wrong');
        }
    };

    const handleSelected = (id) => {
        if (selectedEmail.includes(id)) {
            setSelectedEmail(selectedEmail.filter(data => data !== id));
            setSelectAll(emailList.length === selectedEmail.length - 1);
        } else {
            setSelectedEmail([...selectedEmail, id]);
            setSelectAll(emailList.length === selectedEmail.length + 1);
        }
    }

    const selectAllEmail = (e, value) => {
        if (value) {
            let emailIds = [];
            for (let email of emailList) {
                emailIds.push(email.id);
            }
            setSelectedEmail(emailIds);
        } else {
            setSelectedEmail([]);
        }

        setSelectAll(value);
    }

    const deleteEmail = async (id, deleteType) => {
        try {
            setLoader(true);
            let collectionName = getCollectionName();
            await deleteDoc(doc(collection(db, collectionName), id));
            if (deleteType !== "multiple") setEmailList(emailList.filter((email) => email.id !== id));
            setLoader(false);
        } catch (error) {
            setLoader(false);
            toast.error('Something went wrong');
        }
    }

    const emailReadUnreadToggle = async (id, status, toggleType) => {
        try {
            setLoader(true);
            let collectionName = getCollectionName();
            const collectionRef = collection(db, collectionName);
            await updateDoc(doc(collectionRef, id), { isSeen: !status });
            if (toggleType !== "multiple") setEmailList(emailList.map((email) => { if (email.id === id) return { ...email, isSeen: !status }; else return email }));
            setLoader(false);
        } catch (error) {
            console.log(error)
            setLoader(false);
            toast.error('Something went wrong');
        }
    }

    const selectedEmailReadUnreadToggle = () => {
        for (let emailId of selectedEmail) {
            emailReadUnreadToggle(emailId, false, "multiple");
        }
        setEmailList(emailList.map((email) => { if (selectedEmail.includes(email.id)) return { ...email, isSeen: true }; else return email }));
        setSelectedEmail([]);
        toast.success("Conversations marked as read");
    }

    const selectedEmailDelete = (type) => {
        for (let emailId of selectedEmail) {
            deleteEmail(emailId, "multiple");
        }
        setEmailList(emailList.filter((email) => !selectedEmail.includes(email.id)));
        setSelectedEmail([]);
        toast.success(type === 1 ? "Conversations moved to bin" : "Conversations archieved");
    }

    return (
        <div className='emailList'>
            <div className="emailList__settings">
                <div className="emailList__settingsLeft">
                    <Tooltip title="Select">
                        <IconButton >
                            <Checkbox checked={selectAll} onChange={selectAllEmail} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Select">
                        <IconButton >
                            <ArrowDropDown className='emailList__select__downarrow' />
                        </IconButton>
                    </Tooltip>
                    {selectedEmail.length ?
                        <>
                            <Tooltip title="Archive" onClick={() => selectedEmailDelete(2)}>
                                <IconButton >
                                    <ArchiveOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Report spam" onClick={() => toast.success("Conversation marked as spam")}>
                                <IconButton >
                                    <ReportGmailerrorredOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" onClick={() => selectedEmailDelete(1)}>
                                <IconButton >
                                    <DeleteOutlineOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Mark as read" onClick={selectedEmailReadUnreadToggle}>
                                <IconButton >
                                    <DraftsOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Snooze">
                                <IconButton >
                                    <AccessTimeOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Add to task">
                                <IconButton >
                                    <AddTaskOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Move to">
                                <IconButton >
                                    <DriveFileMoveOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Label">
                                <IconButton >
                                    <LabelOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="More">
                                <IconButton >
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                        </>
                        :
                        <>
                            <Tooltip title="Refresh" onClick={fetchData}>
                                <IconButton >
                                    {loader ? <CircularProgress color="inherit" /> : <Refresh />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="More" onClick={handleClick}>
                                <IconButton >
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                    <Menu
                        anchorEl={anchorEl}
                        open={anchorEl}
                        onClose={handleClose}
                        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                    >
                        <MenuItem onClick={handleClose}>Mark all as read</MenuItem>
                        <hr />
                        <MenuItem disabled={true}>Select messages to see more actions</MenuItem>
                    </Menu>
                </div>
                <div className="emailList__settingsRight">
                    <p>1-{emailList.length} of {emailList.length}</p>
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
            <div className="emailList__sections">
                <Section Icon={PhotoOutlined} title="Primary" selected={tab === 1} tab={1} setTab={setTab} />
                <Section Icon={LocalOfferOutlined} title="Promotions" selected={tab === 2} tab={2} setTab={setTab} />
                <Section Icon={GroupOutlined} title="Social" selected={tab === 3} tab={3} setTab={setTab} />
            </div>
            <div className="emailList__list">
                {emailList.map((email, index) => (
                    <EmailRow isSelected={selectedEmail.includes(email.id)} fetchData={fetchData} key={email.id} id={email.id} isStarred={email.isStarred} title={email.title} subject={email.subject} description={email.description} createdAt={email.createdAt} isSeen={email.isSeen} handleSelected={handleSelected} getCollectionName={getCollectionName} deleteEmail={deleteEmail} emailReadUnreadToggle={emailReadUnreadToggle} index={index} />
                ))}
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

export default EmailList