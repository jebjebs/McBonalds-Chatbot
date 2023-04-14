import React, { useState } from 'react'

const ChatFooter = (props) => {
	const [showChoices, setShowChoices] = useState(true)

	// Send the choice to ChatWindow.js
	const handleClick = (choice, category, key,) => {
		setShowChoices(false)
		props.handleChoice(choice, category, key);
	}


	const buttons = props.choiceSet.choices.map((choice, key) => {
		// key refers to the index of a specific choice
		return (
			<button 
				key={key} 
				className='btn btn-outline-primary rounded-pill col-auto'
				onClick={event => handleClick(event.target.innerText, props.choiceSet.category, key)}
			>
				{choice}
			</button>
		)
	})
	return (
		<>
			<div className="row gap-2 justify-content-center pe-2">
					{props.choiceSet.choices.length > 0 ? buttons : null}
					{/* {showChoices && props.choiceSet.choices.length > 0 ? buttons : null} */}
			</div>
		</>
	)
}

export default ChatFooter