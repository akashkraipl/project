import React, { useState } from 'react'
import './Sidebar.css';
import { Button, IconButton, Tooltip, Dialog, Slide } from '@mui/material';
import SidebarOption from './SidebarOption';
import db from './config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { MinimizeOutlined, OpenInFullOutlined, CloseOutlined, FormatColorTextOutlined, AttachFileOutlined, LinkOutlined, SentimentSatisfiedOutlined, AddToDriveOutlined, InsertPhotoOutlined, LockClockOutlined, EditOutlined, MoreVertOutlined, DeleteOutlineOutlined, PhotoOutlined, StarBorderOutlined, AccessTimeOutlined, SendOutlined, NoteOutlined, CreateOutlined, Add, Send, MaximizeOutlined } from '@mui/icons-material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const startHtml = `<table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding-top:20px;width:100%;font-family: arial;" class="m_-578686285709180796background_main"><tbody><tr><td valign="top" style="max-width: 800px;display:block;" class="m_-578686285709180796sm_full_width"><div style="margin:0 auto;padding:30px 15px 40px 15px;display:block;box-sizing:border-box" class="m_-578686285709180796sm_no_padding"><table cellspacing="0" cellpadding="0" border="0" style="width:100%><tbody><tr><td style="box-sizing:border-box"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td style="font-size: 14px;font-family: SF Pro Display;"><div style="text-align:center; margin-top: 8px;clear: both; background: #FFFFFF; padding: 50px;"><p style="font-family: SF Pro Display; font-size: 17px;">`;
const endHtml = `</p></div></td></tr></tbody></table></td></tr></tbody></table></div></td></tr></tbody></table>`;

const customDialogStyle = {
    position: 'fixed',
    right: 16,
    bottom: -20
};

const initialData = {
    from: "akashkr.aipl@gmail.com",
    to: "",
    title: 'Aakash',
    subject: "",
    description: "",
    isStarred: false,
    isSeen: false,
    createdAt: Date.now()
}

const Sidebar = () => {
    const [minimize, setMinimize] = useState(false);
    const [email, setEmail] = useState(initialData)
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const sendEmail = async () => {
        const collectionRef = collection(db, 'primary-email');

        if (!email.to.trim().length) {
            setErrorMessage("Please specify recipient email.");
            setOpenError(true);
            return;
        } else if (!email.subject.trim().length) {
            setErrorMessage("Please specify email subject.");
            setOpenError(true);
            return;
        } else if (!email.description.trim().length) {
            setErrorMessage("Please specify email description.");
            setOpenError(true);
            return;
        }
        await addDoc(collectionRef, { ...email, body: startHtml + email.description + endHtml });
        setOpen(false);
        setEmail(initialData);
        toast.success('Email sent successfully');
    }

    const handleClickOpen = () => {
        setOpen(true);
        setMinimize(false);
    };

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpen(false);
        setMinimize(false);
        setEmail(initialData);
        if (email.to.trim().length || email.subject.trim().length || email.description.trim().length) toast.warn('Email moved to draft');
    };

    const minimizeToggle = () => {
        setMinimize(!minimize);
    }

    const handleErrorClose = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpenError(false);
    };
    return (
        <div className='sidebar'>
            <Button onClick={handleClickOpen} startIcon={<CreateOutlined fontSize='large' />} className='side__compose' >
                Compose
            </Button>

            <SidebarOption Icon={PhotoOutlined} title="Inbox" number={1} tooltip="Inbox" tab="/inbox" />
            <SidebarOption Icon={StarBorderOutlined} title="Starred" tooltip="Starred" tab="/starred" />
            <SidebarOption Icon={AccessTimeOutlined} title="Snoozed" tooltip="Snoozed" tab="/snoozed" />
            <SidebarOption Icon={SendOutlined} title="Sent" tooltip="Sent" tab="/sent" />
            <SidebarOption Icon={NoteOutlined} title="Drafts" tooltip="Drafts" tab="/draft" />

            <div className="sidebar__footer">
                <h4>Labels</h4>
                <Tooltip title="Create new label" placement='right'>
                    <IconButton >
                        <Add />
                    </IconButton>
                </Tooltip>
            </div>
            <div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    PaperProps={{ style: customDialogStyle }}
                >
                    <div className="compose__header">
                        <div className="compose__header__message">
                            New Message
                        </div>
                        <div className="compose__header__actions">
                            {minimize ? <Tooltip title="Maximize" onClick={minimizeToggle}>
                                <MaximizeOutlined />
                            </Tooltip> : <Tooltip title="Minimize" onClick={minimizeToggle}>
                                <MinimizeOutlined />
                            </Tooltip>}
                            <Tooltip title="Full screen">
                                <OpenInFullOutlined />
                            </Tooltip>
                            <Tooltip title="Close" onClick={handleClose}>
                                <CloseOutlined />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={`compose__input ${minimize ? " display--none" : ""}`}>
                        <input type="email" name="to" placeholder='Recipients' value={email.to} onChange={(e) => setEmail({ ...email, to: e.target.value })} />
                        <input type="text" name="subject" placeholder='Subject' value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} />
                        <textarea name="body" cols="30" rows="27" onChange={(e) => setEmail({ ...email, description: e.target.value })} value={email.description} />
                    </div>
                    <div className={`compose__bottom ${minimize ? " display--none" : ""}`}>
                        <Button variant="contained" endIcon={<Send />} className='compose__send' onClick={sendEmail}>
                            Send
                        </Button>
                        <Tooltip title="Formatting options">
                            <IconButton >
                                <FormatColorTextOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Attach files">
                            <IconButton >
                                <AttachFileOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert link">
                            <IconButton >
                                <LinkOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert emoji">
                            <IconButton >
                                <SentimentSatisfiedOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert files using drive">
                            <IconButton >
                                <AddToDriveOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert photo">
                            <IconButton >
                                <InsertPhotoOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle confidential mode">
                            <IconButton >
                                <LockClockOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert signature">
                            <IconButton >
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="More options">
                            <IconButton >
                                <MoreVertOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Discard draft">
                            <IconButton >
                                <DeleteOutlineOutlined />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Dialog>
            </div>
            <div>
                <Dialog
                    open={openError}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleErrorClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {errorMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleErrorClose}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default Sidebar