import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../shared/UIElemnets/Button";
import Card from "../../shared/UIElemnets/Card";
import Input from "../../shared/UIElemnets/Input";
import ErrorModal from "../../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../../shared/UIElemnets/LoadingSpinner";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./NewParty.css"

const NewParty = props => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            }
        },
        false
    );
    
    const submitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                'http://localhost:4000/parties/new',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    creator: auth.userId
                }),
                {
                    'Content-Type' : 'application/json'
                }
                );
            navigate('/parties/all');
            } catch (err) {}
        }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="new-party">
                <form onSubmit={submitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
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
                    <h2>IMAGE UPLOAD</h2>
                    <Input 
                        id="address" 
                        label="Address:" 
                        element="input" 
                        validators={[VALIDATOR_REQUIRE()]} 
                        errorText="Plaese enter a valid party-address"
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>CREATE PARTY</Button>
                </form>
            </Card>
        </React.Fragment>
    
    )
}

export default NewParty;