import React from 'react'
import profPic from './images/profilePic.jpg'
const ChatHeader = () => {
	return (
		<>
			<div className="row align-items-center">
				<div className="col-auto pe-0">
					<img className='header-pic rounded-circle' src={profPic} />
				</div>
				<div className="col-auto">
					<h4 className='mb-0 text-light'>McBonald's</h4>
				</div>
			</div>
		</>
	)
}

export default ChatHeader