const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Party = require('../models/party-model');
const User = require('../models/user-model');
const fs = require('fs');
const mongoose = require('mongoose');


const getParties = async (req, res, next) => {
    let allParties
    try {
        allParties = await Party.find();
    } catch (err) {
        let error = new HttpError('Fetching parties failed', 500);
        return next(error);
    }

    res.json({ allParties: allParties.map(party => party.toObject({ getters: true })) });
};

const getPartiesById = async (req, res, next) => {
    let userId = req.params.uid;
    let userParties
    try {
        userParties = await Party.find({ creator: userId });
    } catch (err) {
        let error = new HttpError('Fetching parties failed', 500);
        return next(error);
    }

    if (!userParties || userParties === 0) {
        throw new HttpError('Could not find a party with providen user id', 404);
    }
    res.json({ userParties: userParties.map(party => party.toObject({ getters: true })) });
};

const getPartyById = async (req, res, next) => {
    let partyId = req.params.pid;
    let party;
    try {
        party = await Party.findById(partyId);
    } catch (err) {
        throw new HttpError('Could not find a party with providen party id', 404);
    }

    res.status(200).json({ party: party.toObject({ getters: true }) });
};

const createParty = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, plese check your data', 422));
    }

    const { title, description, address, creator } = req.body;
    const createdParty = new Party({
        title,
        description,
        image: 'http://localhost:4000/' + req.file.path,
        address,
        creator,
        savedBy: []
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        let error = new HttpError('Fetching user with providen ID failed', 500);
        return next(error);
    }

    try {
        await createdParty.save();
    } catch (err) {
        let error = new HttpError('Creating party failed', 500);
        return next(error);
    }

    res.status(201).json({ party: createdParty });
};

const updateParty = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, plese check your data', 422));
    }
    const { title, description } = req.body;
    const partyId = req.params.pid;

    let party;
    try {
        party = await Party.findById(partyId)
    } catch {
        let error = new HttpError('Something went wrong, could not update party', 500)
        return next(error);
    }
    party.title = title;
    party.description = description;

    try {
        await party.save();
    } catch (err) {
        let error = new HttpError('Something went wrong, could not update party', 500);
        return next(error);
    }

    res.status(200).json({ party: party.toObject({ getters: true }) });
};

const deleteParty = async (req, res, next) => {
    const partyId = req.params.pid;

    let party;
    try {
        party = await Party.findById(partyId)
    } catch (err) {
        let error = new HttpError('Something went wrong, could not delete party', 500)
        return next(error);
    }

    if (!party) {
        return next(new HttpError('Could not find party with providen id', 404));
    }

    let imagePath = party.image;

    try {
        party.remove();
    } catch (err) {
        let error = new HttpError('Something went wrong, could not delete party', 500);
        return next(error);
    }

    fs.unlink(imagePath, err => console.log(err));
    
    res.status(200).json({ message: "party deleted" });
}

const getSaved = async (req, res, next) => {
    let userId = req.params.uid;

    let savedParties;
    try {
        savedParties = await Party.find({ savedBy: userId });
    } catch (err) {
        let error = new HttpError('Something went wrong, could not delete party', 500)
        return next(error);
    }

    if(!savedParties || savedParties === 0) {
        throw new HttpError('Could not find party with a providen user id', 404);
    }

    res.status(200).json({ savedParties: savedParties.map(party => party.toObject({ getters: true })) });
}

const saveParty = async (req, res, next) => {
    let partyId = req.params.pid;
    let userId = req.body.userId;
    let savedParty;

    try {
        savedParty = await Party.findById(partyId);
    } catch (err) {
        let error = new HttpError('Fetching user failed', 500);
        return next(error);
    }


    if (!savedParty) {
        throw new HttpError('Could not find user with a providen id', 404);
    }
    savedParty.savedBy.push(userId);

    try {
        await savedParty.save();
    } catch (err) {
        let error = new HttpError('Something went wrong, could not delete party', 500);
        return next(error);
    }

    res.status(200).json({ "party": savedParty });
}

const unsaveParty = async (req, res, next) => {
    let partyId = req.params.pid;
    let userId = req.body.userId;
    let savedParty;

    try {
        savedParty = await Party.findById(partyId);
    } catch (err) {
        let error = new HttpError('Fetching party failed', 500);
        return next(error);
    }


    if (!savedParty) {
        throw new HttpError('Could not find user with a providen id', 404);
    }
    savedParty.savedBy.pull(userId);

    try {
        await savedParty.save();
    } catch (err) {
        let error = new HttpError('Something went wrong, could not delete party', 500);
        return next(error);
    }

    res.status(200).json({ "party": savedParty });
}

exports.getParties = getParties;
exports.getPartiesById = getPartiesById;
exports.getPartyById = getPartyById;
exports.createParty = createParty;
exports.updateParty = updateParty;
exports.deleteParty = deleteParty;
exports.getSaved = getSaved;
exports.saveParty = saveParty;
exports.unsaveParty = unsaveParty;