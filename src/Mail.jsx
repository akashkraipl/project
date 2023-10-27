import React, { useEffect, useState } from 'react';
import './Mail.css';
import { AccessTimeOutlined, AddTaskOutlined, ArchiveOutlined, ArrowBack, ChevronRight, DeleteOutlineOutlined, DraftsOutlined, DriveFileMoveOutlined, KeyboardArrowLeft, LabelOutlined, LaunchOutlined, LocalPrintshopOutlined, MoreVert, RedoOutlined, ReportGmailerrorredOutlined, Star, StarBorderOutlined, UndoOutlined } from '@mui/icons-material';
import { Avatar, Button, IconButton, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import db from './config/firebase';
import { collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';

const Mail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [])

  const fetchData = async () => {
    try {
      const documentSnapshot = await getDoc(doc(db, "primary-email", id));

      if (documentSnapshot.exists()) {
        // Document exists, you can access its data
        const data = documentSnapshot.data();
        setEmail({ ...data, id: documentSnapshot.id });
        if (!data.isSeen) {
          const collectionRef = collection(db, "primary-email");
          await updateDoc(doc(collectionRef, id), { isSeen: true });
        }
      } else {
        toast.error('Email not found');
      }
    } catch (error) {
      console.error('Error getting documents: ', error);
      toast.error('Something went wrong');
    }
  };

  const deleteEmail = async (type) => {
    try {
      await deleteDoc(doc(collection(db, "primary-email"), id));
      toast.success(type === 1 ? "Conversation moved to bin" : "Conversation archieved");
      navigate(-1);
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  const emailReadUnreadToggle = async () => {
    try {
      const collectionRef = collection(db, "primary-email");
      await updateDoc(doc(collectionRef, id), { isSeen: !email.isSeen });
      fetchData();
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong');
    }
  }

  const toggleStarred = async () => {
    const collectionRef = collection(db, "primary-email");
    await updateDoc(doc(collectionRef, id), { isStarred: !email.isStarred });
    fetchData();
}

  return (
    <div className='mail'>
      <div className="mail__actions">
        <div className="mail__actions__left">
          <Tooltip title="Back to inbox" onClick={() => navigate(-1)} className='mr-2'>
            <IconButton >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Tooltip title="Archive" onClick={() => deleteEmail(2)}>
            <IconButton >
              <ArchiveOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Report spam" onClick={() => toast.success("Conversation marked as spam")}>
            <IconButton >
              <ReportGmailerrorredOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" onClick={() => deleteEmail(1)}>
            <IconButton >
              <DeleteOutlineOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title={email?.isSeen ? "Mark as unread" : "Mark as read"} onClick={emailReadUnreadToggle}>
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
        </div>
        <div className="mail__actions__right">
          <p>2 of 10</p>
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
      <div className="mail__container">
        <div className="mail__subject">
          <h1>{email?.subject}</h1>
          <div className="mail__subject__right">
            <Tooltip title="Print all">
              <IconButton >
                <LocalPrintshopOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="In new window">
              <IconButton >
                <LaunchOutlined />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="mail__contact">
          <div className="mail__contact__left">
            <Avatar />
            <div className="email__from__name">{email?.title}</div>
            <div className="email__from__email">&lt;{email?.from}&gt;</div>
          </div>
          <div className="mail__contact__right">
            <div>{moment(email?.createdAt).format('ddd, D MMM, HH:mm')} ({moment(email?.createdAt).fromNow()})</div>
            <Tooltip title={email?.isStarred ? "Starred" : "Not starred"} onClick={toggleStarred}>
              <IconButton >
                {email?.isStarred ? <Star className={email?.isStarred ? "starred__email" : ""} /> : <StarBorderOutlined />}
              </IconButton>
            </Tooltip>
            <Tooltip title="More">
              <IconButton >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="mail__body">
          <div className="mail__body__container">
            <p dangerouslySetInnerHTML={{ __html: email?.body }}></p>
          </div>
          <div className="mail__buttons">
            <Button variant="outlined" className='mail__button' startIcon={<UndoOutlined />} >Reply</Button>
            <Button variant="outlined" className='mail__button' startIcon={<RedoOutlined />}>Forward</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mail;