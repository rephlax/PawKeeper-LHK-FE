import React, { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'  // Add X icon for close button

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && <button onClick={handleClick} className="bg-blue-600 text-white">
                <MessageSquare className="h-6 w-6" />
            </button>}

            {isOpen && (
                <div id='chat-container' className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
                    <div id='chat-header' className="p-4 bg-blue-600 text-white flex justify-between">
                        <h3>Chat Room</h3>
                        <button onClick={handleClick}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div id='chat-message-comp' className="flex-1 overflow-y-auto p-4">
                        {/* Messages component will go here later */}
                    </div>

                    <div id='chat-input-comp' className="p-4 border-t">
                        {/* Message input component will go here later */}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatWidget