const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const partyControllers = require('../controllers/party-controller');
const fileUpload = require('../middlware/file-upload');
const { route } = require('./user-routes');

router.get('/all', partyControllers.getParties);
router.get('/:uid', partyControllers.getPartiesById);
router.get('/party/:pid', partyControllers.getPartyById);
router.post(
    '/new',
    fileUpload.single('image'),
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ], 
    partyControllers.createParty
);

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
    ],
    partyControllers.updateParty
);

router.get('/get-saved/:uid', partyControllers.getSaved);

router.post(
    '/save/:pid',
    [ check('userId').not().isEmpty() ],
    partyControllers.saveParty
);

router.post(
    '/unsave/:pid',
    [ check('userId').not().isEmpty() ],
    partyControllers.unsaveParty
);

router.delete('/:pid', partyControllers.deleteParty);

module.exports = router;