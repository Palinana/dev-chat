import React from 'react';
import { shallow } from 'enzyme';

import { Starred } from './Starred';

describe('Starred component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Starred />);

        wrapper.setState({
            starredChannels: [
                {
                    createdBy: {
                        avatar: "http://gravatar.com/avatar/ffda1dfe8503a28100147ddd8b857bb4?d=identicon", 
                        name: "Lora S."
                    },
                    datails: "test",
                    id: "-Lsy3S8w9-b",
                    name: "test1",
                },
                {
                    createdBy: {
                        avatar: "http://gravatar.com/avatar/ffda1dfe8503a28100147ddd8b857bb4?d=identicon", 
                        name: "Lora S."
                    },
                    datails: "test",
                    id: "-Lsy3S8w9-b",
                    name: "test2",
                }
            ],
            user: {
                displayName: "Lora S.",
                email: "lora@gmail.com"
            }
        })
    });

    it('should be 2 starred channels of a current user', () => {
        expect(wrapper.find('.starred-channels').children().length).toEqual(2);
    });

    it('should render 2 starred channels on the panel', () => {
        expect(wrapper.find('.starred__header--title').text()).toEqual('STARRED (2)');
    });

    it('should render first starred channel name on the panel', () => {
        expect(wrapper.find('.starred-channel').at(0).text()).toEqual('# test1');
    });

    it('should render second starred channel name on the panel', () => {
        expect(wrapper.find('.starred-channel').at(1).text()).toEqual('# test2');
    });

    it('should render first starred channel on the panel', () => {
        expect(wrapper.find('.starred-channel').at(0).text()).toEqual('# test1');
    });
});