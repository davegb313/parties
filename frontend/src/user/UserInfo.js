import React, { useState, useEffect, useContext } from "react";

import AttendingItem from "../parties/components/AttendingItem";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import ErrorModal from "../shared/UIElemnets/ErrorModal";
import LoadingSpinner from "../shared/UIElemnets/LoadingSpinner";
import PartyList from "../parties/components/PartyList";
import Avatar from "../shared/UIElemnets/Avatar";
import Button from "../shared/UIElemnets/Button";
import Card from "../shared/UIElemnets/Card";

import "./UserInfo.css";

const UserInfo = props => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUser, setLoadedUser] = useState();
    const [loadedUserParties, setLoadedUserParties] = useState();
    const [loadedSavedUserParties, setSavedUserParties] = useState();
    const userId = auth.userId

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDataRes = await sendRequest(`http://localhost:4000/user/${userId}`);
                setLoadedUser(userDataRes.user);
            } catch (err) { }

            try {
                const userPartiesRes = await sendRequest(`http://localhost:4000/parties/${userId}`);
                userPartiesRes ? setLoadedUserParties(userPartiesRes.userParties) : setLoadedUserParties([]);
            } catch (err) { }

            try {
                const userSavedPartiesRes = await sendRequest(`http://localhost:4000/parties/get-saved/${userId}`);
                userSavedPartiesRes ? setSavedUserParties(userSavedPartiesRes.savedParties) : setSavedUserParties([]);
            } catch (err) { }
        }
        fetchUser()
    }, [sendRequest])

    const partyDeletedHandler = deletedPartyId => setLoadedUserParties(
        prevParties => prevParties.filter(party => party.id !== deletedPartyId)
    );

    const partyUnsaveHandler = unsavedPartyId => setSavedUserParties(
        prevParties => prevParties.filter(party => party.id !== unsavedPartyId)
    );

    return (
        <React.Fragment>
            <ErrorModal error={error} onClick={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUser && loadedUserParties && loadedSavedUserParties && (
                <>
                    <div className="user-info">
                        <Card className="personal-info">
                            <div className="personal-info-img">
                                <Avatar
                                    image={loadedUser.image}
                                    alt={"user-photo"}
                                />
                                <h3>{loadedUser.username}</h3>
                            </div>
                            <div className="personal-info-email">
                                <h4>Email:</h4>
                                <p>{loadedUser.email}</p>
                            </div>
                        </Card>
                        <div className="user-attend">
                            <h3 className="attending-title">Parties you're attending at:</h3>
                            {(loadedSavedUserParties.length === 0) ? (
                                <div className="party-list center">
                                    <Card>
                                        <h2>There are no saved parties found. Want save one?</h2>
                                        <Button to="/parties/all">Save Party</Button>
                                    </Card>
                                </div>
                            ) : (
                                <ul className="attending-list">
                                    {loadedSavedUserParties.map(party => (
                                        <AttendingItem
                                            key={party.id}
                                            id={party.id}
                                            image={party.image}
                                            title={party.title}
                                            description={party.description}
                                            address={party.address}
                                            onUnsave={partyUnsaveHandler} />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="your-parties-header">
                        <h1>Your Parties</h1>
                    </div>
                    <PartyList items={loadedUserParties} isLoggedIn={true} onDeleteParty={partyDeletedHandler} />
                </>
            )}
        </React.Fragment>
    )
}

export default UserInfo;