import React from 'react';
import { shallow } from 'enzyme';

import { Login } from './Login';

describe('Login component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Login />);
    });

    describe('checking the behavior of the login part ', () => { 

        it('renders login at the top of the form', () => {
            expect(wrapper.find('h1').at(1).text()).toEqual('Login');
        });
    
        it('renders login button', () => {
            expect(wrapper.find('.btn__auth--main').exists()).toBe(true); 
        });

        it('renders social icons', () => {
            expect(wrapper.find('.social-container').children().length).toEqual(3);
        });

        it('renders forgot password', () => {
            expect(wrapper.find('.social-container').children().length).toEqual(3);
        });
    })

    describe('checking the behavior of the sign up part ', () => { 
        
        it('renders greeding message for sign up', () => {
            expect(wrapper.find('h1').at(0).text()).toEqual('Hello, Friend!');
        });
    
        it('renders sign up button', () => {
            expect(wrapper.find('.link__password').exists()).toBe(true); 
        });
    })

    describe('checking the behavior of the login form ', () => { 
        let testUser = {
            email: 'testTest@gmail.com',
            password: '758347582'
        };

        beforeEach(() => {     
            wrapper.find('input').at(0).simulate('change', {
                target: { name: 'email', value: testUser.email }
            });

            wrapper.find('input').at(0).simulate('change', {
                target: { name: 'password', value: testUser.password }
            });

            const fakeEvent = { preventDefault: () => console.log('preventDefault') };
            wrapper.find('.form').simulate('submit', fakeEvent);
        }); 

        it('updates the user email on state', () => {
            expect(wrapper.state().email).toEqual(testUser.email);
        });

        it('updates the user password on state', () => {
            expect(wrapper.state().password).toEqual(testUser.password);
        });

        it('updates loading on state', () => {
            expect(wrapper.state().loading).toEqual(true);
        });

        it('updates errors array is empty on state', () => {
            expect(wrapper.state().errors).toEqual([]);
        });
    })
});