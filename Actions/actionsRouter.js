const express = require('express');
const actionsDb = require('../data/helpers/actionModel.js');

const router = express.Router();

const { validateActionId } = require('../middleware');

router.get('/', async (req, res) => {
    try {
        const actions = await actionsDb.get();

        if (actions.length > 0) {
            res.status(200).json(actions)
        } else {
            res.status(404).json({message: 'There are no actions to display'})
        }
    } catch {
        res.status(500).json({errorMessage: 'There was a problem getting the actions from the database'})
    }
})

router.get('/:id', validateActionId, async (req, res) => {
    try {
        const { id } = req.params;
        const action = await actionsDb.get(id);

        if (action){
            res.status(200).json(action)
        } else {
            res.status(404).json({message: 'The action with the specified ID does not exist'})
        }
    } catch {
        res.status(500).json({errorMessage: 'There was a problem getting the action from the database'})
    }
})

router.delete('/:id', validateActionId, async (req, res) => {

    try {
        const { id } = req.params;
        const action = await actionsDb.get(id);

        if (action) {
            const deleteAction = await actionsDb.remove(id)
            res.status(200).json(deleteAction)
        } else {
            res.status(404).json({message: 'The action with the specified ID doesn not exist'})
        }
    } catch {
        res.status(500).json({errorMessage: 'The action could not be deleted'})
    }
})

router.put('/:id', validateActionId, async (req, res) => {

    const { body } = req;
    const { id } = req.params;
    const action = await actionsDb.get(id);

    try {

          if (action) {
        if(body.descripiton && body.notes){
            const updateAction = await actionsDb.update(id, body)
            res.status(200).json(updateAction)
        } else {
            res.status(400).json({message: 'Please enter a vild description and notes for the action'})
        }
    } else {
        res.status(404).json({message: 'The action with the specified ID does not exist'})
    }
    } catch {
        res.status(500).json({errorMessage: 'There was a problem updating the action'})
    }

})

module.exports = router;