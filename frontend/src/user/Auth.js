import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../shared/UIElemnets/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from "../shared/util/validators";
import ErrorModal from "../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../shared/UIElemnets/LoadingSpinner";
import { useForm } from "../shared/hooks/form-hook";
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";
import ImageUpload from "../shared/UIElemnets/ImageUpload";
import Card from "../shared/UIElemnets/Card";
import Input from "../shared/UIElemnets/Input";
import "./Auth.css";

const Auth = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFromData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            },
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFromData({
                ...formState.inputs,
                username: undefined
            },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFromData({
                ...formState.inputs,
                username: {
                    value: '',
                    isValid: false
                }
            },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmithandler = async event => {
        event.preventDefault();
        if (isLoginMode) {
            try {
                let response = await sendRequest(
                    'http://localhost:4000/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(response.user.id);
                navigate('/parties/all');
            } catch (err) { };
        } else {
            try {
                let response = await sendRequest(
                    'http://localhost:4000/signup',
                    'POST',
                    JSON.stringify({
                        username: formState.inputs.username.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(response.user.id);
                navigate('/parties/all');
            } catch (err) { }
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="auth">
                {isLoading && <LoadingSpinner asOverlay />}
                {isLoginMode ? <h2>LOGIN</h2> : <h2>SIGNUP</h2>}
                <form>
                    {!isLoginMode && (
                        <Input
                            id="username"
                            label="username"
                            element="input"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Plaese enter a valid username"
                            onInput={inputHandler}
                        />
                    )}
                    <Input
                        id="email"
                        label="email"
                        element="input"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Plaese enter a valid email"
                        onInput={inputHandler}
                    />
                    {!isLoginMode && (
                        <ImageUpload id='image' />
                    )}
                    <Input
                        id="password"
                        label="password"
                        element="input"
                        type="password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Plaese enter a valid password"
                        onInput={inputHandler}
                    />
                    <div className="auth-footer">
                        <Button type="button" onClick={authSubmithandler} disabled={!formState.isValid}>
                            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                        </Button>
                    </div>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </React.Fragment>
    )
}

export default Auth;