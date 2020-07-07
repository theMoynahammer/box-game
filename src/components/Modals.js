import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const Modals = ({modalToShow, toggleModal, savePlayerInfo, handleChange, selectedBackground, playerName}) => {
    // modalToShow options are:
    // - notes
    // - playerInfo
    // - help
    // - statReset
    return (
        <React.Fragment>
            <Modal centered={true} show={modalToShow === 'notes'} onHide={() => toggleModal('notes')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Connor's Future Enhancements</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Here are some enhancements I would like to make:
                            <ul>
                            <li>Remove margin from righthand side</li>
                            <li>✅ Save background choice</li>
                            <li>Allow profile to be created</li>
                            <li>Create API backend to manage accounts</li>
                            <li>Make mad, mad cash</li>
                            <li>Add undo functionality</li>
                            <li>Write How to play section</li>
                            <li>Add deck of cards animation</li>
                            <li>Add samesies</li>
                            <li>Enhance Unlockables</li>
                            <li>Prevent screen refreshing to avoid loss count</li>
                        </ul>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => toggleModal('notes')}>
                            Close
                        </Button>
                        {/* <Button variant="primary" onClick={this.toggleHelpModal}>
                            Save Changes
                        </Button> */}
                    </Modal.Footer>
                </Modal>
                <Modal backdrop='static' centered={true} show={modalToShow === 'playerInfo'}>
                    <Modal.Header >
                        <Modal.Title>Enter your name and pick a background</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Username</Form.Label>
                                <Form.Control maxLength="12" required name="playerName" onChange={(e)=> handleChange(e)} value={playerName} type="text" />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Background Image</Form.Label>
                                <Form.Control value={selectedBackground} name="selectedBackground" onChange={(e)=> handleChange(e)} as="select">
                                    <option value="amEx">AmEx</option>
                                    <option value="darkPattern">Dark Pattern</option>
                                    <option value="earth">Earth</option>
                                    <option value="mars">Mars</option>
                                    <option value="moon">Moon</option>
                                    <option value="underwater">Underwater</option>
                                    <option value="wood">Wood</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button role="button" variant="secondary" onClick={() => savePlayerInfo()}>
                            Save
                        </Button>
                        {/* <Button variant="primary" onClick={this.toggleHelpModal}>>
                            Save Changes
                        </Button> */}
                    </Modal.Footer>
                </Modal>
                <Modal centered={true} show={modalToShow === 'help'} onHide={() => toggleModal('help')}>
                    <Modal.Header closeButton>
                        <Modal.Title>How to Play</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <strong>Intro: </strong>The Box Game started out as a drinking game at Virginia Tech, and now
                        it's being presented to you by Connor. <br /><br />
                        <strong>Objective:</strong> Go through the 52 card deck before all 9 card piles are flipped over. On your turn,
                        choose Higher or Lower on one of the available piles by clicking the top half or bottom half of the card. If you are
                        correct, the pile remains available. If you are wrong, the pile is flipped over and is no longer available for selection.
                        <br /><br />
                        <strong>Stats/Unlockables</strong> There are rewards for winning X number of games. Keep playing to see if you can unlock them all.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => toggleModal('help')}>
                            Close
                        </Button>
                        {/* <Button variant="primary" onClick={this.toggleHelpModal}>
                            Save Changes
                        </Button> */}
                    </Modal.Footer>
                </Modal>
                <Modal centered={true} show={modalToShow === 'statReset'} onHide={() => toggleModal('statReset')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Clicking Confirm will erase all of your stats and reset your progress towards unlockables.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.toggleModal('showStatResetModal')}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => { toggleModal('statReset'); this.clearStats() }}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
        </React.Fragment>
    );
}

export default Modals;
