import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import BookItem from './BookItem';

export default function Books() {
  const [books, setBooks] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    Axios.get('/wp-json/wp/v2/books')
      .then(res => {
        setBooks(res.data)
        setIsLoaded(true)

        
      })
      .catch(err => console.log(err))

  }, [])

  if (isLoaded) {
    return (
      <div>
        {books.map(book => (
           <BookItem key={book.id} book={book}/>
        ))}
      </div>
    )
  }
  
  return (
    <h3>Loading</h3>
  )
}
