import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';

import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import firebase from '../../firebase';
import FileModal from './FileModal';

import './MessageForm.css';

export class MessageForm extends Component {
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
        percentUploaded: 0,
        typingRef: firebase.database().ref('typing'),
        emojiPicker: false
    }

    componentWillUnmount(){
        if(this.state.uploadTask !== null ) {
            this.state.uploadTask.cancel();
            this.setState({uploadTask: null})
        }
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    };

    handleKeyDown = () => {
        const { message, typingRef, channel, user } = this.state;
        
        if (message) {
            typingRef
              .child(channel.id)
              .child(user.uid)
              .set(user.displayName);
        } 
        else {
            typingRef
              .child(channel.id)
              .child(user.uid)
              .remove();
        }
    };

    handleTogglePicker = () => {
        this.setState({ emojiPicker: !this.state.emojiPicker });
    };

    handleAddEmoji = emoji => {
        // console.log('this.messageInputRef ', this.messageInputRef)
        const oldMessage = this.state.message;
        const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons}`);
        this.setState({ message: newMessage, emojiPicker: false });
        setTimeout(() => this.messageInputRef.focus(), 0);
    };

    // converts emoji value to unicode(using emojiIndex)
    colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
          x = x.replace(/:/g, "");
          let emoji = emojiIndex.emojis[x];
          if (typeof emoji !== "undefined") {
            let unicode = emoji.native;
            if (typeof unicode !== "undefined") {
              return unicode;
            }
          }
          x = ":" + x + ":";
          return x;
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { getMessagesRef } = this.props;
        const { message, channel, user, typingRef } = this.state;

        if(message) {
            this.setState({ loading: true });
            getMessagesRef()  
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] });
                    typingRef
                        .child(channel.id)
                        .child(user.uid)
                        .remove();
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
            message["image"] = fileURL;
        }
        else {
            message["content"] = this.state.message;
        }
        return message;
    }

    getPath = () => {
        if(this.props.isPrivateChannel) {
            return `chat/private/${this.state.channel.id}`;
        }
        else {
            return 'chat/public';
        }
    }

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
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
        const { errors, message, loading, modal, uploadState, emojiPicker } = this.state;
        
        return (
            <div className="reply-container">
                <form className="reply__form" onSubmit={this.handleSubmit}>                
                    <div className="reply__form-container">
                        <button className="reply__attach" onClick={this.openModal} type="button" disabled={uploadState === 'uploading'}>
                            <img alt="send-icon" className="reply__attach-image" src={require('../../Assets/Images/clip.svg')} />
                        </button>
                        <label className="reply__label">
                            <FileModal 
                                modal={modal}
                                closeModal={this.closeModal}
                                uploadFile={this.uploadFile}
                            />
                            {emojiPicker && (
                                <Picker
                                    set="apple"
                                    className="emojipicker"
                                    onSelect={this.handleAddEmoji}
                                    title="Pick your emoji"
                                    emoji="point_up"
                                />
                            )}
                            <input 
                                type="text" 
                                name="message"
                                placeholder="Write your message" 
                                value={message}
                                onChange={this.handleChange}
                                onKeyDown={this.handleKeyDown}
                                ref={node => (this.messageInputRef = node)}
                            />
                        </label>
                        <button 
                            className="emoji__btn" 
                            disabled={loading} 
                            type="button"
                            onClick={this.handleTogglePicker}
                        >
                            <img alt="send-icon" className="emoji__btn--submit-image" src={require('../../Assets/Images/smile.svg')} />
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default MessageForm;