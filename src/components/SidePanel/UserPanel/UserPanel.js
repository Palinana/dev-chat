import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';

import firebase from '../../../firebase';

import './UserPanel.css';

export class UserPanel extends Component {
    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: "",
        croppedImage: "",
        blob: "",
        uploadedCroppedImage: "",
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        metadata: {
          contentType: "image/jpeg"
        },
        isLoading: false
    }

    dropdownOptions = () => [
        {
          key: "user",
          text: (
            <span>
              Signed in as <strong> {this.state.user.displayName}</strong>
            </span>
          ),
          disabled: true
        },
        {
          key: "avatar",
          text: <span onClick={this.openModal}>Change Avatar</span>
        },
        {
          key: "signout",
          text: <span onClick={this.handleLogout}>Sign Out</span>
        }
    ];

    uploadCroppedImage = () => {
        const { storageRef, userRef, blob, metadata } = this.state;
        this.setState({ isLoading: true });
        storageRef
            .child(`avatars/users/${userRef.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({ uploadedCroppedImage: downloadURL }, () =>
                        this.changeAvatar()
                    );
                });
            });
    }

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log("photoUrl updated");
                this.closeModal();
                this.setState({ isLoading: false });
            })
            .catch(err => {
                console.error(err);
            });

        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.uploadedCroppedImage })
            .then(() => {
                console.log("User Avatar updated");
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        if (file) {
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.setState({ previewImage: reader.result });
          });
        }
    }

    handleCropImage = () => {
        if(this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({ 
                    croppedImage: imageUrl,
                    blob
                });
            });
        }
    }

    handleLogout = () => {
        firebase.auth().signOut()
            .then()
    }

    openModal = () => this.setState({ modal: true });
    
    closeModal = () => this.setState({ modal: false });

    render() {
        const { user, modal, previewImage, croppedImage } = this.state;

        return (
            <div className="user-panel">
                <h1 className="user-panel__title">DevChat</h1>
                <Dropdown
                  trigger={
                    <span>
                      <Image src={user.photoURL} spaced="right" avatar />
                      {user.displayName}
                    </span>
                  }
                  options={this.dropdownOptions()}
                  className="user-panel__toggle"
                />

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Change Avatar</Modal.Header>
                    <Modal.Content>
                        <Input 
                            fluid
                            type="file"
                            label="New Avatar"
                            name="previewImage"
                            onChange={this.handleChange}
                        />
                        <Grid centered stackable columns={2}>
                            <Grid.Row centered>
                                <Grid.Column className="ui center aligned grid">
                                    { previewImage && (
                                        <AvatarEditor 
                                            ref={node => (this.avatarEditor = node)}
                                            image={previewImage}
                                            width={120}
                                            height={120}
                                            border={50}
                                            scale={1.2}
                                        />
                                    )}
                                </Grid.Column>
                                <Grid.Column>
                                    { croppedImage && (
                                        <Image 
                                            style={{ margin: "3.5em auto" }}
                                            width={100}
                                            height={100}
                                            src={croppedImage}
                                        />
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>

                    <Modal.Actions>
                        { croppedImage && <Button color="green" inverted onClick={this.uploadCroppedImage}>
                            <Icon name="save"/> Change Avatar
                        </Button>}
                        <Button color="green" inverted onClick={this.handleCropImage}>
                            <Icon name="image"/> Preview
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove"/> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default UserPanel;
