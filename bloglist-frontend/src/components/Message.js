const Message = ({ text, error }) => {

  if (text === null) {
    return null
  }
  if (error === true) {
    return (
      <div className='error'>{text}</div>
    )
  }
  return (
    <div className='success'>
      <p>{text}</p>
    </div>
  )
}

export default Message