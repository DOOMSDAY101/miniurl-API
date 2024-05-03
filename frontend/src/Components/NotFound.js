import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className='not-found-div'>
            <h1 className='not-found-text'>404 PAGE NOT FOUND</h1>
            <Link to="/" className='home-link'>Home Page</Link>
        </div>
    )
}

export default NotFound
