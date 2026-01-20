import React from 'react'

const search = ({searchItem, SetSearchItem}) => {
  return (
    <div className='search'>
     <div>
        <img src='./search.svg' alt='search' />
        <input 
        type='text'
        placeholder='Search your movie journey from here'
        value={searchItem}
        onChange={(event) => SetSearchItem(event.target.value)}
        />
     </div>
    </div>
  )
}

export default search
