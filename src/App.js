import React from 'react';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mail from './Mail';
import EmailList from './EmailList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarredEmailList from './StarredEmailList';
import Snooze from './Snooze';
import Sent from './Sent';
import Drafts from './Drafts';

const NoPage = () => {
  return <h1>No page found</h1>
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="app__body">
          <Sidebar />
          <Routes>
            <Route path="/">
              <Route index element={<EmailList />} />
              <Route path='inbox' element={<EmailList />} />
              <Route path='starred' element={<StarredEmailList />} />
              <Route path='snoozed' element={<Snooze />} />
              <Route path='sent' element={<Sent />} />
              <Route path='draft' element={<Drafts />} />
              <Route path="inbox/mail/:id" element={<Mail />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
          <ToastContainer
            position="bottom-left"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='dark'
          />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
