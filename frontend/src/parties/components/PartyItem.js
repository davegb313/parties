import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../shared/UIElemnets/Card";
import Button from "../../shared/UIElemnets/Button";
import Modal from "../../shared/UIElemnets/Modal";
import ErrorModal from "../../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../../shared/UIElemnets/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PartyItem.css";

const PartyItem = props => {
    const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [showModal, setShowModal] = useState(false);
    const openModalHandler = () => setShowModal(true);
    const closeModalHandler = () => setShowModal(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const partyId = props.id;

    const [formState, inputHandler, setFromData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    },
        false
    );

    const submitHandler = event => {
        event.preventDefault();
        // setFormData(
        //     {
        //       title: {
        //         value: responseData.place.title,
        //         isValid: true
        //       },
        //       description: {
        //         value: responseData.place.description,
        //         isValid: true
        //       }
        //     },
        //     true
        //   );

        setShowModal(false);
    };
    const toUpdatingMode = props => navigate(`/parties/party/${partyId}`);

    const deleteParty = async () => {
        try {
            await sendRequest(
                `http://localhost:4000/parties/${partyId}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            )
            props.onDelete(props.id);
        } catch (err) { }
    };

    const saveParty = async () => {
        try {
            await sendRequest(
                `http://localhost:4000/parties/save/${partyId}`,
                'POST',
                JSON.stringify({
                    userId: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )
        } catch (err) { }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
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
                        {(props.creator === auth.userId) ? (<Button onClick={deleteParty}>DELETE</Button>) : null}
                        {(props.creator === auth.userId)
                            ?
                            (<Button onClick={toUpdatingMode}>UPDATE</Button>)
                            :
                            ((<Button onClick={saveParty}>ATTEND</Button>))}
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
            <li className="party-item">
                <Card>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="party-item-image">
                        <img
                            src={props.image}
                            alt={props.title}
                        />
                    </div>
                    <div className="party-item-footer">
                        <h2>{props.title}</h2>
                        <div className="party-item-buttons">
                            <Button onClick={openModalHandler}>DETAILS</Button>
                            {props.isLoggedIn ?
                                null :
                                (
                                    (props.creator === auth.userId) ?
                                        null :
                                        (<Button onClick={saveParty}>ATTEND</Button>)
                                )
                            }
                        </div>
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
}

export default PartyItem;