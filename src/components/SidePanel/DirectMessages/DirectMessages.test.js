import React from 'react';
import { shallow } from 'enzyme';

import { DirectMessages } from './DirectMessages';

describe('DirectMessages component', () => {
    let wrapper;

    const props = {
        currentUser: {
            displayName: "Lora S.",
            email: "lora@gmail.com",
            emailVerified: false
        },
        isPrivateChannel: false,
        handleMenu: jest.fn()
    };

    beforeEach(() => {
        wrapper = shallow(<DirectMessages {...props} />);

        wrapper.setState({
            users: [
                {
                    avatar: "http://gravatar.com/avatar/6f414bef4e1193725cc478ff5ae42c98?d=identicon",
                    name: "Cody Smith",
                    status: "offline",
                    uid: "bwFx993",
                },
                {
                    avatar: "http://gravatar.com/avatar/6f414bef4e1193725cc478ff5ae42c98?d=identicon",
                    name: "Tom Lowe",
                    status: "online",
                    uid: "bwFxrrr993",
                }
            ]
        })
    });

    it('should be 2 direct messages available', () => {
        expect(wrapper.find('.direct-message').children().length).toEqual(2);
    });

    it('should render 2 direct messages available on the panel', () => {
        expect(wrapper.find('.direct-messages__header--title').text()).toEqual('DIRECT MESSAGES (2)');
    });
   
});