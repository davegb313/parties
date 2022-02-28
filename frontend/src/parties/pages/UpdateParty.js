import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../shared/UIElemnets/Button";
import Card from "../../shared/UIElemnets/Card";
import ErrorModal from "../../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../../shared/UIElemnets/LoadingSpinner";
import Input from "../../shared/UIElemnets/Input";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './UpdateParty.css';

const UpdateParty = () => {
    const navigate = useNavigate();
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
        let fetchParty = async () => {
            try {
                let resData = await sendRequest(`http://localhost:4000/parties/party/${partyId}`)
                setLoadedParty(resData.party);
                setFormData(
                    {
                        title: {
                            value: resData.party.title,
                            isValid: true
                        },
                        description: {
                            value: resData.party.description,
                            isValid: true
                        }
                    },
                    true
                );
            } catch (err) { }
        };
        fetchParty();
    }, [sendRequest, partyId, setFormData]);

    const submitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:4000/parties/${partyId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                { 'Content-Type': 'application/json' }
            );
            navigate('/parties/all')
        } catch (err) { }
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!loadedParty && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedParty && (
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
                            initialValue={loadedParty.title}
                            initialValid={true}
                        />
                        <Input
                            id="description"
                            label="What's goin on there(description):"
                            element="input"
                            validators={[VALIDATOR_MINLENGTH(5)]}
                            errorText="Plaese enter a valid party-description(min. 5 symbols)"
                            onInput={inputHandler}
                            initialValue={loadedParty.description}
                            initialValid={true}
                        />
                        <Button type="submit" disabled={!formState.isValid}>UPDATE PARTY</Button>
                    </form>
                </Card>
            )}
        </React.Fragment>
    )
}

export default UpdateParty;