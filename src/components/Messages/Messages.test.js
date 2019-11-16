import React from 'react';
import { shallow } from 'enzyme';

import { Messages } from './Messages';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

describe('Messages component', () => {
    let wrapper;
    let messageMap = {};

    const props = {
        currentChannel: {
            details: "test",
            id: "-Lsy5RnEIVkg3terte3S8w9-b",
            name: "test",
        },
        isPrivateChannel: false,
        handleMenu: jest.fn()
    };

    beforeEach(() => {
        wrapper = shallow(<Messages {...props} />);
        wrapper.setState({
            messages: [
                {
                    content: "message one",
                    timestamp: 1573686388021,
                    user: {
                        id: "aa7VsbHKfsOnQj2",
                        name: "Tester"
                    }
                },
                {
                    content: "message two",
                    timestamp: 1573686388021,
                    user: {
                        id: "aa7VsbHKfsOnQj2",
                        name: "Tester"
                    }
                }
            ],
            channnel: {
                details: "test",
                id: "-Lsy5RnE33S8w9-b",
                name: "test"
            },
            numUniqueUsers: "1 user",
            privateChannel: false,
            user: {
                displayName: "Tester S.",
                email: "test@gmail.com"
            }
        })
    });

    it('should have messages on state', () => {
        // console.log(wrapper.debug()) 
        // console.log(wrapper.state()); 
        // const instance = wrapper.instance();
        // console.log('instance',instance) 
        expect(wrapper.state().messages.length).toEqual(2);
    });

    it('should render <Message/> when receiving messages', () => {
        expect(wrapper.find(Message)).toHaveLength(2);
    });

    it('<Message/> component receiving 1 user from <Messages/>', () => {
        expect(wrapper.find(MessagesHeader).reduce((messageMap, message) => {
            const messageProps = message.props()
            messageMap['numUniqueUsers'] = messageProps.numUniqueUsers;
            return messageMap;
        }, {})
        ).toEqual({"numUniqueUsers": "1 user"})
    });

    it('<Message/> component receiving 2 messages from <Messages/>', () => {
        expect(wrapper.find(MessagesHeader).reduce((messageMap, message) => {
            const messageProps = message.props()
            messageMap['channelMessages'] = messageProps.channelMessages;
            return messageMap;
        }, {})
        ).toEqual({"channelMessages": "2 messages"})
    });

    it('<Message/> component receiving right name from <Messages/>', () => {
        expect(wrapper.find(MessagesHeader).reduce((messageMap, message) => {
            const messageProps = message.props()
            messageMap['channelName'] = messageProps.channelName;
            return messageMap;
        }, {})
        ).toEqual({"channelName": "#test"})
    });

    it('should render <MessagesHeader/> component', () => {
        expect(wrapper.find(MessagesHeader).exists()).toBeTruthy();
    });

    it('should render <MessageForm/> component', () => {
        expect(wrapper.find(MessageForm).exists()).toBeTruthy();
    });
    
});