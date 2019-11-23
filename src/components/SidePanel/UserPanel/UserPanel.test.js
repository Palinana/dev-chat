import React from 'react';
import { shallow } from 'enzyme';

import { UserPanel } from './UserPanel';

describe('UserPanel component', () => {
    let wrapper;

    const props = {
        currentUser: {
            displayName: "Lora S.",
            email: "lora@gmail.com",
            emailVerified: false
        },
        setCurrentChannel: jest.fn(),
        setPrivateChannel: jest.fn()
    };

    beforeEach(() => {
        wrapper = shallow(<UserPanel {...props}/>);

        wrapper.setState({
            user: {
                displayName: "Lora S.",
                email: "lora@gmail.com",
                photoURL: "http://gravatar.com/avatar/6f414bef4e1193725cc478ff5ae42c98?d=identicon",
                uid: "bwFx993",
            }
                
        })
    });

    it('renders the application name', () => {
        expect(wrapper.find('.user-panel__title').text()).toEqual('DevChat');    
    });

    it('renders the user dropdown menu', () => {
        expect(wrapper.find('Dropdown').exists()).toBe(true);  
    });

    it('renders change avatar modal', () => {
        expect(wrapper.find('Modal').exists()).toBe(true);  
    });

});