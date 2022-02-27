import React, { useState } from "react";

import Card from "../../shared/UIElemnets/Card";
import Modal from "../../shared/UIElemnets/Modal";
import Button from "../../shared/UIElemnets/Button";
import "./AttendingItem.css";

const AttendingItem = props => {

    const [showModal, setShowModal] = useState(false);
    const openModalHandler = () => setShowModal(true);
    const closeModalHandler = () => setShowModal(false);

    const submitHandler = event => {
        setShowModal(false);
    };

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
                            <Button>RESIGN</Button>
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
            <li className="attending-item" key={props.id}>
                <Card className="attending-item-card">
                    <h3>{props.title}</h3>
                    <div>
                        <Button onClick={openModalHandler}>DETAILS</Button>
                        <Button>RESIGN</Button>
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default AttendingItem;