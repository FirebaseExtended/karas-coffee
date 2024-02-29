import React, { useEffect, useState } from 'react';
import { MinChatUiProvider, MessageInput, MessageContainer, MessageList, MessageHeader } from '@minchat/react-chat-ui';
import { useChat } from '../hooks/useChat';
import { useUser } from '../hooks/useUser';
import { useChatMutation } from '../hooks/useChatMutation';
import { useChatContextMutation } from '../hooks/useChatContextMutation';
import { useVectorSearch } from '../hooks/useVectorSearch';
import { Product } from '../types';
import { useSearchTermExtractor } from '../hooks/useSearchTermExtractor';
import { User } from 'firebase/auth';

type FirestoreMessage = {
  prompt: string;
  response: string;
};

type Message = {
  text: string;
  user: {
    id: string;
    name: string;
  };
};

const firestoreMessageToMessage = ({ prompt, response }: FirestoreMessage): [Message, Message] => [
  { text: prompt, user: { id: 'user', name: 'User' } },
  { text: response, user: { id: 'karabot', name: 'Karabot' } },
];

export function Chat() {
  const user = useUser();

  useEffect(() => {
    console.log(user.data);
  }, [user.data, user.isSuccess]);

  const [isOpen, setIsOpen] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);

  const chat = useChat('jacob');
  const chatMutation = useChatMutation();

  useEffect(() => {
    if (chat.isSuccess && chat.data) {
      //@ts-ignore TODO: fix this
      const transformedMessages = chat.data.map(firestoreMessageToMessage).flat();
      setMessages(transformedMessages);
    }
  }, [chat.isSuccess, chat.data]);

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    chatMutation.mutate({});
    if (isOpen && user.data && user.data.uid) {
      //
      // set some initial context with past purchases
    }
  };

  const handleSendMessage = (text: string) => {
    // build context from past purchases and current vector search results

    // const newVectorSearchQuery = [...messages.map((message) => message.text), text].join('\n');

    chatMutation.mutate({ prompt: text, searchQuery: text });
  };

  return (
    <div>
      <button className="fixed top-1/2 left-1/2 bg-green-100 p-4 rounded" onClick={handleOpenChat}>
        {isOpen ? 'Open Chat' : 'Close Chat'}
      </button>
      <div
        className={`w-1/3 fixed bg-gray-300 h-[calc(100vh-5rem)] rounded top-20 -right-3 z-1000 p-2 transition duration-700 ${
          !isOpen ? '' : 'translate-x-[100%]'
        }`}
      >
        <MinChatUiProvider theme="#6ea9d7" colorSet={myColorSet}>
          <MessageContainer>
            <MessageList currentUserId="user" messages={messages} />
            <MessageInput
              placeholder="Type message here"
              showSendButton
              showAttachButton={false}
              onSendMessage={handleSendMessage}
            />
          </MessageContainer>
        </MinChatUiProvider>
      </div>
    </div>
  );
}

const colors = {
  // Theme Colors
  themeDark: '#111827',
  themeLighterDark: '#1E293B',
  themeLightGray: '#D1D5DB',
  themeMediumGray: '#9CA3AF',
  themeDarkGray: '#6B7280',
  themeDarkerGray: '#2D3748',
  themeDividerGray: '#374151',
  themeLastActiveGray: '#4B5563',

  // Text Colors
  lightGrayText: '#1F2937',

  // Element Colors
  lightBlueElement: '#3B82F6',
  lighterBlueForElements: '#D1D5DB',

  // Accent Colors
  greenAccent: '#10B981',

  // Placeholder & Other Specific Uses
  mediumGrayForAttachments: '#9CA3AF',
  darkGrayForPlaceholders: '#6B7280',
};

const myColorSet = {
  // input
  '--input-background-color': colors.themeLighterDark,
  '--input-text-color': colors.lightGrayText,
  '--input-element-color': colors.themeLightGray,
  '--input-attach-color': colors.themeMediumGray,
  '--input-send-color': colors.greenAccent,
  '--input-placeholder-color': colors.themeDarkGray,

  // message header
  '--message-header-background-color': colors.lightGrayText,
  '--message-header-text-color': colors.themeLightGray,
  '--message-header-last-active-color': colors.themeLastActiveGray,
  '--message-header-back-color': colors.themeMediumGray,

  // chat list header
  '--chatlist-header-background-color': colors.themeDark,
  '--chatlist-header-text-color': colors.themeLightGray,
  '--chatlist-header-divider-color': colors.themeDividerGray,

  // chatlist
  '--chatlist-background-color': colors.themeDark,
  '--no-conversation-text-color': colors.themeLightGray,

  // chat item
  '--chatitem-background-color': colors.themeLighterDark,
  '--chatitem-selected-background-color': colors.themeDividerGray,
  '--chatitem-title-text-color': colors.themeLightGray,
  '--chatitem-content-text-color': colors.themeMediumGray,
  '--chatitem-hover-color': colors.themeDarkerGray,

  // main container
  '--container-background-color': colors.themeDark,

  // loader
  '--loader-color': colors.themeLastActiveGray,

  // message list
  '--messagelist-background-color': colors.themeDark,
  '--no-message-text-color': colors.themeLightGray,

  // incoming message
  '--incoming-message-text-color': colors.themeLightGray,
  '--incoming-message-name-text-color': colors.themeMediumGray,
  '--incoming-message-background-color': colors.themeLighterDark,
  '--incoming-message-timestamp-color': colors.themeDarkGray,
  '--incoming-message-link-color': colors.lightBlueElement,

  // outgoing message
  '--outgoing-message-text-color': colors.themeLightGray,
  '--outgoing-message-background-color': colors.themeLighterDark,
  '--outgoing-message-timestamp-color': colors.themeMediumGray,
  '--outgoing-message-checkmark-color': colors.themeLighterDark,
  '--outgoing-message-loader-color': colors.themeMediumGray,
  '--outgoing-message-link-color': colors.lightBlueElement,
};
