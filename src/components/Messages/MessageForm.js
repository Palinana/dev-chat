import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase';
import FileModal from './FileModal';

import './MessageForm.css';

class MessageForm extends Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0
    }

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if(message) {
            this.setState({ loading: true });
            messagesRef  
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ loading: false, errors: this.state.errors.concat(err) })
                })
        }
        else {
            this.setState({ errors: this.state.errors.concat({ message: 'Add a message' })})
        }
    } 

    createMessage = (fileURL = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        }
        if(fileURL !== null) {
            message['image'] = fileURL;
        }
        else {
            message['content'] = this.state.message;
        }
        return message;
    }

    getPath = () => {
        if(this.props.isPrivateChannel) {
            return `chat/private-${this.state.channel.id}`;
        }
        else {
            return 'chat/public';
        }
    }

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `${this.getPath()}/${uuidv4().jpg}`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },  //callback
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    this.setState({ percentUploaded })
                },
                    err => {
                        console.log(err);
                        this.setState({ 
                            errors: this.state.errors.concat(err),
                            uploadTask: null,
                            uploadState: 'error'
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL()
                            .then(downloadURL => {
                                this.sendFileMessage(downloadURL, ref, pathToUpload);
                            })
                            .catch(err => {
                                console.log(err);
                                this.setState({ 
                                    errors: this.state.errors.concat(err),
                                    uploadTask: null,
                                    uploadState: 'error'
                                })
                            })
                    }
                )
            }
        )
    }

    sendFileMessage = (fileURL, ref, pathToUpload ) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileURL))
            .then(() => {
                this.setState({ uploadState: 'done'})
            })
            .catch(err => {
                console.log(err);
                this.setState({ 
                    errors: this.state.errors.concat(err)
                })
            })
    }

    render() {
        const { errors, message, loading, modal, uploadState } = this.state;
        return (
            <div className="reply-container">
                <form className="reply__form" onSubmit={this.handleSubmit}>
                    <label className="reply__label">

                        <button className="reply__attach" onClick={this.openModal} type="button" disabled={uploadState === 'uploading'}>
                            <img alt="send-icon" className="reply__attach-image" src={require('../../Assets/Images/clip.svg')} />
                        </button>

                        <FileModal 
                            modal={modal}
                            closeModal={this.closeModal}
                            uploadFile={this.uploadFile}
                        />
                        <input 
                            type="text" 
                            name="message"
                            placeholder="Write your message" 
                            value={message}
                            onChange={this.handleChange}
                        />

                        <button className="reply__btn" disabled={loading} type="submit">
                            <img alt="send-icon" className="reply__btn--submit-image" src={require('../../Assets/Images/send.svg')} />
                        </button>
                    </label>
                </form>
            </div>
        )
    }
}

export default MessageForm;