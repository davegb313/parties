import React from "react";
import AttendingItem from "../parties/components/AttendingItem";

import PartyList from "../parties/components/PartyList";
import Avatar from "../shared/UIElemnets/Avatar";
import Card from "../shared/UIElemnets/Card";

import "./UserInfo.css";

const DUMMY_DATA = [
    {
        id: "p1",
        title: "TLV hook up",
        description: "fantastic party in tel-aviv",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/14/03/b3/4e/tlv.jpg",
        address: "Carlebach St 4, Tel Aviv-Yafo, 6713208",
        creatorId: "someId1"
    },
    {
        id: "p2",
        title: "TLV hook up",
        description: "fantastic party in tel-aviv",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/14/03/b3/4e/tlv.jpg",
        address: "Carlebach St 4, Tel Aviv-Yafo, 6713208",
        creatorId: "someId3"
    },
    {
        id: "p3",
        title: "TLV hook up",
        description: "fantastic party in tel-aviv",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/14/03/b3/4e/tlv.jpg",
        address: "Carlebach St 4, Tel Aviv-Yafo, 6713208",
        creatorId: "someId3"
    }
]

const UserInfo = props => {

    return (
        <React.Fragment>
            <div className="user-info">
                <Card className="personal-info">
                    <div className="personal-info-img">
                        <Avatar 
                            image="https://media.istockphoto.com/vectors/user-avatar-profile-icon-black-vector-illustration-vector-id1209654046?k=20&m=1209654046&s=612x612&w=0&h=Atw7VdjWG8KgyST8AXXJdmBkzn0lvgqyWod9vTb2XoE="
                            alt={"user-photo"} 
                        />
                        <h3>username</h3>
                    </div>
                    <div className="personal-info-email">
                        <h4>Email:</h4>
                        <p>trolo@fsdk.kdfs</p>
                    </div>
                </Card>
                <div className="user-attend">
                    <h3 className="attending-title">Parties you're attending at:</h3>
                    <ul className="attending-list">
                        {DUMMY_DATA.map(party => (
                           <AttendingItem 
                                key={party.id}
                                id={party.id}
                                image={party.image}
                                title={party.title}
                                description={party.description}
                                address={party.address}/>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="your-parties-header">
                <h1>Your Parties</h1>
            </div>
            <PartyList items={DUMMY_DATA} isLoggedIn={true} />
        </React.Fragment>
    )
}

export default UserInfo;