import React, { useEffect, useState } from "react";

import Button from "../../shared/UIElemnets/Button";
import Card from "../../shared/UIElemnets/Card";
import ErrorModal from "../../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../../shared/UIElemnets/LoadingSpinner";
import Input from "../../shared/UIElemnets/Input";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './UpdateParty.css';
import { useParams } from "react-router-dom";

const UpdateParty = () => {
    const partyId = useParams().partyId;
    const [loadedParty, setLoadedParty] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
        {
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

    useEffect(() => {
        let fetchParty = () => {
            sendRequest(`http://localhost:4000/parties/party/${partyId}`)
                .then(par => setLoadedParty(par.party));
        }
        fetchParty();
        console.log(loadedParty);
    }, [sendRequest]);

    const submitHandler = event => {
        event.preventDefault();
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="new-party">
                <form onSubmit={submitHandler}>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <Input
                        id="title"
                        label="Name your party:"
                        element="input"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Plaese enter a valid party-title"
                        onInput={inputHandler}
                    />
                    <Input
                        id="description"
                        label="What's goin on there(description):"
                        element="input"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Plaese enter a valid party-description(min. 5 symbols)"
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>UPDATE PARTY</Button>
                </form>
            </Card>
        </React.Fragment>
    )
}

export default UpdateParty;