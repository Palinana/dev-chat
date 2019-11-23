import React from 'react';
import { shallow } from 'enzyme';

import { MessageForm } from './MessageForm';

describe('MessageForm component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<MessageForm />);
    });


    it('renders the message form', () => {
        expect(wrapper.find('form').exists()).toBe(true); 
    });

    it('renders an attach image button', () => {
        expect(wrapper.find('.reply__attach').exists()).toBe(true); 
    });

    it('renders file modal for image upload', () => {
        expect(wrapper.find('FileModal').exists()).toBe(true); 
    });

    it('renders an emoji button', () => {
        expect(wrapper.find('.emoji__btn').exists()).toBe(true); 
    });

    describe('checking the behavior of the message form ', () => { 
        let testMessage = 'test_message';

        beforeEach(() => {     
            wrapper.find('input').simulate('change', {
                target: { name: 'message', value: testMessage }
            });
        }); 

        it('updates the message in state', () => {
            expect(wrapper.state().message).toEqual(testMessage);
        });
    })
});