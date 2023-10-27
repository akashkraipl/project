import React from 'react';
import './Section.css';

const Section = ({ Icon, title, selected, tab, setTab }) => {
    return (
        <div className={`section ${selected && "section--selected"}`} onClick={() => setTab(tab)}>
            <Icon />
            <h4>{title}</h4>
        </div>
    )
}

export default Section;