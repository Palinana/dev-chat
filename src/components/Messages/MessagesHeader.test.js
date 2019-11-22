import React from 'react';
import { shallow } from 'enzyme';

import { MessagesHeader } from './MessagesHeader';
import { Messages } from './Messages';

describe('MessagesHeader component', () => {
    let wrapper;

    const props = {
        channelName: "#test",
        channelMessages: "2 messages",
        isPrivateChannel: false,
        handleMenu: jest.fn(),
        handleStar: jest.fn(),
        isChannelStarred: true,
        isPrivateChannel: false,
        numUniqueUsers: "2 users",
        searchLoading: false,
        handleSearchChange: jest.fn()
    };

    beforeEach(() => {
        wrapper = shallow(<MessagesHeader {...props} />);
    });

    it('should render channel name in <MessagesHeader/> receivied from props', () => {
        expect(wrapper.find('.messages__header-info__name').text()).toEqual('#test');
    });

    it('should render number of users in <MessagesHeader/> receivied from props', () => {
        expect(wrapper.find('.messages__header-info__stats--users').text()).toEqual('2 users');
    });

    it('should render number of messages in <MessagesHeader/> receivied from props', () => {
        expect(wrapper.find('.messages__header-info__stats--messages').text()).toEqual('2 messages');
    });

    it('should add the star-filled class if channel is starred', () => {
        expect(wrapper.find('.fas fa-star star-filled').exists());
    });

    it('should render the form for search', () => {
        expect(wrapper.find('form').exists()).toBe(true); 
    });
});