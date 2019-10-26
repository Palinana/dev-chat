import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Chat from './components/Chat/Chat';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Spinner from './components/UI/Spinner';

import { setUser, clearUser } from './store';
import firebase from './firebase';

class Routes extends Component {
    componentDidMount() {
        //redirecting exsting user
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.props.setUser(user);
                this.props.history.push('/');
            }
            else {
                this.props.history.push('/login');
                this.props.clearUser();
            }
        });
    }

    render() {
        return this.props.isLoading ? 
            <Spinner /> 
            : (
                <Switch>
                    <Route exact path="/" component={Chat} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={Signup} />
                </Switch>
            )
    }
}

const mapState = state => {
    return {
        isLoading: state.user.isLoading
    }
}

const mapDispatch = dispatch => {
    return {
        setUser(user) {
            dispatch(setUser(user))
        },
        clearUser() {
            dispatch(clearUser())
        }
    }
}

export default withRouter(connect(mapState, mapDispatch)(Routes));
