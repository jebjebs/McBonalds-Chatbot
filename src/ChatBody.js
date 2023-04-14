import React, { useEffect, useRef } from 'react'
import profPic from './images/profilePic.jpg'

const ChatBody = ({ messageList, handleLastMessage, handleSummarizeOrder }) => {
  const bottomRef = useRef(null)

  
  useEffect(() => {
    // if lastMessage.category is summarizeOrder, call summarizeOrder function
    if (messageList[messageList.length - 1].category == "summarizeOrder") {
      handleSummarizeOrder()
    }

    // if going to render choices, no delay
    // else, add delay when rendering bot response to simulate thinking
    if (messageList[messageList.length-1].isBotResponse) {

      handleLastMessage(messageList[messageList.length - 1])
      bottomRef.current?.scrollIntoView({behavior: 'auto'});

    } else {

      let timer = setTimeout(() => {
        // send last message to ChatWindow
        handleLastMessage(messageList[messageList.length - 1])
      }, 500);
      bottomRef.current?.scrollIntoView({behavior: 'auto'});
      return () => clearTimeout(timer)
    }
  }, [messageList]) //this executes everytime messageList is updated (i.e. new message is added)
  

  const messages = messageList.map((message, key) => {
    // bot response
    if (message.isBotResponse) {
      return (
        // key refers to index of message in the messageList
        <div className="row align-items-end my-3" key={key}>
          <div className="chatbot-response col-auto">
            <img className='chat-pic rounded-circle' src={profPic} alt="" />
          </div>
          <div className='chat-body col-auto shadow'>{message.message}</div>
        </div>
      )
    }

    // if user response
    return (
      <div className="row align-items-end justify-content-end" key={key}>
        <div className='chat-body col-auto bg-primary shadow text-white'>{message.message}</div>
      </div>
    )
  })


  return (
    <>
      {messages}

      {/* used in autoscrolling to bottom */}
      <div ref={bottomRef} />
    </>
  )
}

export default ChatBody