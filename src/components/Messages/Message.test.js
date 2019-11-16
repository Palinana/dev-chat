import React from 'react';
import { shallow } from 'enzyme';
import Message from './Message';

describe('Messages component', () => {
    let wrapper;
    let messageMap = {};

    const props = {
        message: {
            content: "Hey there!",
            timestamp: 1573780860204,
            user: {
                avatar: "http://gravatar.com/avatar/6f414bef4e1193725cc478ff5ae42c98?d=identicon",
                id: "bwFxJl7JIgenFg3",
                name: "Test S."
            }
        },
        user: {
            displayName: "Test S.",
            email: "test@gmail.com"
        },
        showDay: true,
        date: '11/14/2019'
    };

    beforeEach(() => {
        wrapper = shallow(<Message {...props} />);
    });

    it('should add date div as showDay is equal to True', () => {
        expect(wrapper.find('.day__text').exists()).toBeTruthy();
    });

    it('should render the exact date from the props', () => {
        expect(wrapper.find('.day__text').text()).toEqual('11/14/2019');
    });

    it('should not add date div as showDay is equal to False', () => {
        wrapper.setProps({ showDay: false })
        expect(wrapper.find('.day__text').exists()).toBeFalsy();
    })

    it('should render user avatar', () => {
        expect(wrapper.find('img').prop('src')).toEqual('http://gravatar.com/avatar/6f414bef4e1193725cc478ff5ae42c98?d=identicon');        
    });

    it('should render user name', () => {
        expect(wrapper.find('.message__details-name').text()).toEqual('Test S.');
    })

    it('should render user time', () => {
        expect(wrapper.find('.message__details-time').text()).toEqual('8:21 PM');
    })

    it('should render user message', () => {
        expect(wrapper.find('.message__details-text').text()).toEqual('Hey there!');
    })

});