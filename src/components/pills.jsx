import React from 'react'

const Pills = ({ image, text, onClick }) => {
    return (
        <span className='pill-container' onClick={onClick}>
            <span><img src={image} alt={text} />
            </span><span>{text} &times;</span>
        </span>
    )
}

export default Pills