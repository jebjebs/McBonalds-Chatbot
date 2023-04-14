import React, { useState, Component } from 'react'
import ChatHeader from './ChatHeader'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'

const ChatWindow = () => {
  const [messageList, setMessageList] = useState([{
    isBotResponse: true, 
    category: "addOrder",
    responseId: 0, 
    message:'Welcome to McBonald\'s! I\'m your bot cashier, McBot. What would you like to order?'
  }])

  const [choiceSet, setChoiceSet] = useState({
    choicesId: 0,
    category: "meal",
    choices: ['Burger Meal', 'Pasta Meal', 'Chicken Meal'],
  })

  const [currentOrder, setCurrentOrder] = useState({
    meal: "",
    snacks: [], //can be empty
    friesSize: "",
    drink: "",
    drinkSize: "",
  })

  const [allOrders, setAllOrders] = useState([])

  const handleSummarizeOrder = () => {
    let summary = "In the meantime, here is a summary of your order:\n\n"

    allOrders.forEach((order) => {
      const fries = order.friesSize !== "" ? `${order.friesSize} Fries and ` : ""
      let snacks = ""

      if (order.snacks.length == 2) {
        snacks = `, and an additional ${order.snacks[0]} and ${order.snacks[1]}`
      } else if (order.snacks.length == 1) {
        snacks = `, and an additional ${order.snacks[0]}`
      }
      summary += `– 1 ${order.meal} with ${fries}${order.drinkSize} ${order.drink}${snacks}`;
      summary += "\n"
      console.log(summary)
    })

    const message = {
      isBotResponse: true,
      category: "end",
      responseId: 9, 
      message: summary
    }

    setMessageList([...messageList, message])
  }

  // called by ChatFooter with user's selected choice as parameter
  const handleChoice = (choice, category, key) => {
    const message = {
      isBotResponse: false,
      category: category,
      responseId: key,
      message: choice,
    }
    setMessageList([...messageList, message]) //after adding to messageList, send to ChatBody
  }

  // function for adding bot response to messageList
  const addMessage = (responseObject) => {
    // choose a random response
    let random = Math.floor(Math.random() * responseObject.responseOptions.length)
    const message = {
      isBotResponse: true,
      category: responseObject.category,
      responseId: responseObject.responsesId, 
      message: responseObject.responseOptions[random]
    }
    setMessageList([...messageList, message])
  }

  const handleLastMessage = (lastMessage) => {
    if (lastMessage.isBotResponse) { //for showing the correct choices
      if (lastMessage.category == "addOrder") {
        setChoiceSet(choices[0])
      } else if (lastMessage.category == "askDrink") {
        setChoiceSet(choices[1])
      } else if (lastMessage.category == "askSnack") {
        setChoiceSet(choices[2])
      } else if (lastMessage.category == "askFriesSize") {
        setChoiceSet(choices[3])
      } else if (lastMessage.category == "askDrinkSize") {
        setChoiceSet(choices[3])
      } else if (lastMessage.category == "addSundae") {
        setChoiceSet(choices[4])
      } else if (lastMessage.category == "addPie") {
        setChoiceSet(choices[4])
      } else if (lastMessage.category == "askOrderComplete") {
        setChoiceSet(choices[4])
      } else {
        setChoiceSet(choices[5])
      }

    // if lastMessage is user-selected choice e.g. Burger Meal, Soft Drink
    } else {
      if (lastMessage.category == "meal") {
        setCurrentOrder({...currentOrder, meal: lastMessage.message})
        
        // if burger/pasta meal
        if (lastMessage.responseId == 0 || lastMessage.responseId == 1) {
          addMessage(responses[1])
        } else { // if chicken meal
          addMessage(responses[2])
        }

      } else if (lastMessage.category == "drink") {
        setCurrentOrder({...currentOrder, drink: lastMessage.message})
        addMessage(responses[4])

      } else if (lastMessage.category == "snack") {
        lastMessage.message != "Fries" && setCurrentOrder({...currentOrder, snacks: [...currentOrder["snacks"], lastMessage.message]})
        
        if (lastMessage.responseId == 0) {
          addMessage(responses[3])
        } else {
          addMessage(responses[2])
        }

      } else if (lastMessage.category == "upSize") {
        const size = (lastMessage.responseId == 2 ? "Regular" : lastMessage.message)
        if (messageList[messageList.length-5].category == "snack") {
          setCurrentOrder({...currentOrder, drinkSize: size})
          addMessage(responses[7]) //askOrderComplete
        } else if (messageList[messageList.length-2].category == "askFriesSize") {
          setCurrentOrder({...currentOrder, friesSize: size})
          addMessage(responses[2]) //askDrink
        } else {
          setCurrentOrder({...currentOrder, drinkSize: size})
          addMessage(responses[5]) //addSundae
        }

      } else if (lastMessage.category == "yesNo") {

        if (messageList[messageList.length-2].category == "addSundae" || messageList[messageList.length-2].category == "addPie") {
          const snack = (messageList[messageList.length-2].category == "addSundae" ? "Sundae" : "Pie")
          {lastMessage.responseId == 0 && setCurrentOrder({...currentOrder, snacks: [...currentOrder["snacks"], snack]})}
          addMessage(responses[7])
          
        } else {

          if (lastMessage.responseId == 0 ) {

            if (messageList[messageList.length-4].category == "addPie") { // if user's order is complete
              setAllOrders([...allOrders, currentOrder]) //append current order to all orders
              addMessage(responses[8])
            } else {
              addMessage(responses[6])
            }

          } else { //if user wants to add a new order
            setAllOrders([...allOrders, currentOrder]) //append current order to all orders
            setCurrentOrder({
              meal: "",
              snacks: [],
              friesSize: "",
              drink: "",
              drinkSize: "",
            })

            // get a new order
            addMessage(responses[0])
          }
        }
      }
    }
  }
  

  return (
    <div className='container-fluid mt-5'>
      <div className="row justify-content-center">
        <div className="col-9 col-md-8">
          <div className="card border-0 shadow">
            <div className="card-header border-0 bg-primary">
              <ChatHeader />
            </div>
            <div className="card-body scrollable">
              <ChatBody 
              messageList={messageList} 
              handleLastMessage={handleLastMessage}
              handleSummarizeOrder={handleSummarizeOrder} />
            </div>
            <div className="card-footer border-0">
              <ChatFooter handleChoice={handleChoice} choiceSet={choiceSet} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const choices = [
  {
    choicesId: 0,
    category: "meal",
    choices: ['Burger Meal', 'Pasta Meal', 'Chicken Meal'],
  },
  {
    choicesId: 1,
    category: "drink",
    choices: ['Soft Drink', 'Iced Tea'],
  },
  {
    choicesId: 2,
    category: "snack",
    choices: ['Fries', 'Sundae'],
  },
  {
    choicesId: 3,
    category: "upSize",
    choices: ['Medium', 'Large', 'No Thanks'],
  },
  {
    choicesId: 4,
    category: "yesNo",
    choices: ['Yes', 'No']
  },
  {
    choicesId: 5,
    category: "end",
    choices: []
  }
]

// if response is responses[1] (askSnack), choice should be choices[2]

const responses = [
  {
    responsesId: 0,
    category: "addOrder",
    responseOptions: [
      'What would you like to add?',
      'No problem! You can choose another order.'
    ], // choices[0]
  },
  {
    responsesId: 1,
    category: "askSnack",
    responseOptions: [ // choices[2]
      'And what would you like for your snack?', 
      'Great! What would your snack be?',
    ],
  },
  {
    responsesId: 2,
    category: "askDrink",
    responseOptions: [ // choices[1]
      'What drink would you like?',
      'Kindly choose your drink.',
    ],
  },
  {
    responsesId: 3,
    category: "askFriesSize",
    responseOptions: [ // choices[3]
      'Would you like to upgrade your fries?',
      'Should I upgrade your fries?',
    ],
  },
  {
    responsesId: 4,
    category: "askDrinkSize",
    responseOptions: [ // choices[3]
      'Would you like to upgrade your drink?',
      'Should I upgrade your drink?',
    ],
  },
  {
    responsesId: 5,
    category: "addSundae",
    responseOptions: [ // choices[4]
      'Would you like to add a sundae to your order?',
    ],
  },
  {
    responsesId: 6,
    category: "addPie",
    responseOptions: [ // choices[4]
      'I noticed you didn\'t order a pie. Should I add one?',
      'Would you like to add a pie to your order?',
    ],
  },
  {
    responsesId: 7,
    category: "askOrderComplete",
    responseOptions: [ // choices[4]
      'Would that be all?',
      'Is your order complete?',
    ],
  },
  {
    responsesId: 8,
    category: "summarizeOrder",
    responseOptions: [
      'All right! I have received your complete order, and it will be prepared shortly.'
    ]
  }
]

export default ChatWindow