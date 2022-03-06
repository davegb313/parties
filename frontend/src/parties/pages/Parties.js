import React, { useContext, useEffect, useState } from "react";

import PartyList from "../components/PartyList";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../../shared/UIElemnets/LoadingSpinner";
import "./Parties.css";

const Parties = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedParties, setLoadedParties] = useState();

    useEffect(() => {
        // const sendRequest = async () => {
        //     setIsLoading(true);
        //     try {
        //         const response = await fetch('http://localhost:4000/parties');
        //         if (!response.ok) {
        //             throw new Error(resData.message);
        //         }
        //         setLoadedParties(resData.allParties);
        //         const resData = await response.json();
        //     } catch (err) {
        //         setError(err);
        //     }
        //     setIsLoading(false);
        // };
        let fetchParties = () => {
            sendRequest('http://localhost:4000/parties/all')
                .then(par => setLoadedParties(par.allParties));
        };
        fetchParties();
    }, [sendRequest]);

    const partyDeletedHandler = deletedPartyId => {
        setLoadedParties(prevParties => prevParties.filter(party=> party.id !== deletedPartyId));
    }

    return (
        <React.Fragment>
            <div className="parties">
                <div className="parties-header">
                    <h1>Parties</h1>
                </div>
                <ErrorModal error={error} onClick={clearError} />
                {isLoading && (
                    <div className="center">
                        <LoadingSpinner />
                    </div>
                )}
                {!isLoading && loadedParties && <PartyList 
                                                    items={loadedParties} 
                                                    userId={auth.userId} 
                                                    isLoggedIn={false} 
                                                    onDeleteParty={partyDeletedHandler}/>
                }
            </div>
        </React.Fragment>);
}

export default Parties;