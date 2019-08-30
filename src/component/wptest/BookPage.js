import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom'

export default function BookPage(props) {
  const [book, setBook] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    Axios.get(`/wp-json/wp/v2/books/${props.match.params.id}`)
      .then(res => {
        setBook(res.data)
        setIsLoaded(true)
      })
      .catch(err => console.log(err))
  }, [])

  if (isLoaded) {
    return (
      <div>
        <Link to='/wptest'>Go Back</Link>
        <hr/>
        <h1>{book.title.rendered}</h1>
        <div dangerouslySetInnerHTML={{__html: book.content.rendered}}></div>
        <h4>Publisher: {book.acf.publisher}</h4>
      </div>
    )
  }

  return <h3>Loading...</h3>
}
