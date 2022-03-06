import React, { useState, useContext } from "react";

import Card from "../../shared/UIElemnets/Card";
import Modal from "../../shared/UIElemnets/Modal";
import Button from "../../shared/UIElemnets/Button";
import ErrorModal from "../../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../../shared/UIElemnets/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./AttendingItem.css";

const AttendingItem = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext); 
    const [showModal, setShowModal] = useState(false);
    const openModalHandler = () => setShowModal(true);
    const closeModalHandler = () => setShowModal(false);
    const partyId = props.id;
    console.log(props.id);

    const submitHandler = event => {
        setShowModal(false);
    };

    const resignFromParty = async () => {
        try {
            await sendRequest(
                `http://localhost:4000/parties/unsave/${partyId}`,
                'POST',
                JSON.stringify({
                    userId: auth.userId
                }),
                {
                    'Content-Type': 'application/json'
                }
            )

            props.onUnsave(props.id);
        } catch (err) {}
    } 

    return (
        <React.Fragment>
            <Modal
                show={showModal}
                onClose={closeModalHandler}
                onSubmit={submitHandler}
                header={
                    <React.Fragment>
                        <h2>{props.title}</h2>
                        <Button onClick={closeModalHandler}>X</Button>
                    </React.Fragment>
                }
                footer={
                    <React.Fragment>
                            <Button onClick={resignFromParty}>RESIGN</Button>
                    </React.Fragment>
                }
            >
                <img
                    src={props.image}
                    alt={props.title}
                />
                <h3>About:</h3>
                <h2>{props.description}</h2>
                <h3>We're partying at:</h3>
                <p>{props.address}</p>
            </Modal>
            <ErrorModal error={error} onClick={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            <li className="attending-item" key={props.id}>
                <Card className="attending-item-card">
                    <h3>{props.title}</h3>
                    <div>
                        <Button onClick={openModalHandler}>DETAILS</Button>
                        <Button onClick={resignFromParty}>RESIGN</Button>
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default AttendingItem;