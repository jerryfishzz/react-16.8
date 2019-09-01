import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom'

export default function BookItem({ 
  book: { id, title, excerpt, featured_media, author } 
}) {
  const [imgUrl, setImgUrl] = useState('')
  const [theAuthor, setTheAuthor] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const getImageUrl = Axios.get(`/wp-json/wp/v2/media/${featured_media}`)
    const getAuthor = Axios.get(`/wp-json/wp/v2/users/${author}`)
    
    Promise.all([getImageUrl, getAuthor]).then(res => {
      setImgUrl(res[0].data.media_details.sizes.full.source_url)
      setTheAuthor(res[1].data.name)
      setIsLoaded(true)
    })
  }, [])

  if (isLoaded) {
    return (
      <div>
        <h2 style={{marginBottom: 0}}>{title.rendered}</h2>
        <small>Review by <strong>{ theAuthor }</strong></small>
        <img 
          style={{width: '100%'}} 
          src={imgUrl} 
          alt={title.rendered} 
        />
        <div dangerouslySetInnerHTML={{ __html: excerpt.rendered}}></div>
        <Link to={`/wptest/${id}`}>Read Review</Link>
        <hr />
      </div>
    )
  }
  
  return null
}
