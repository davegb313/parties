import React from "react";

import PartyItem from "./PartyItem";
import Card from "../../shared/UIElemnets/Card";
import Button from "../../shared/UIElemnets/Button";
import "./PartyList.css";

const PartyList = props => {
    if (props.items.length === 0) {
        return (
            <div className="party-list center">
                <Card>
                    <h2>There are no parties found. Want create one?</h2>
                    <Button to="/parties/new">Create Party</Button>
                </Card> 
            </div>
        );
    }

    return (
        <ul className="party-list">
            {props.items.map(party=>(
                <PartyItem 
                id={party.id}
                key={party.id}
                image={party.image}
                title={party.title}
                creator={party.creator}
                description={party.description}
                address={party.address}
                isLoggedIn={props.isLoggedIn}
                onDelete={props.onDeleteParty}
                />
                ))}
        </ul>
    )
}

export default PartyList;