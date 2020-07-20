const projectsDb = require('./data/helpers/projectModel');
const actionsDb = require('./data/helpers/actionModel');

module.exports = {
    validateProjectId,
    validateProject,
    validateAction,
    validateActionId
};

function validateProjectId (req, res, next) {
    const { id } = req.params;
    projectsDb.get(id)
        .then(project => {
            req.project = project
            next()
        })
        .catch(err => {
            res.status(404).json({message: 'Not a valid project'})
        });
}

function validateProject (req, res, next) {
    const { body } = req;
    const projectInfo = Object.keys(body);
    projectInfo.length === 0 || projectInfo === {} ?
    res.status(404).json({message: 'Missing user data'})
    : !body.name && !body.description || body.name && body.description === '' ?
    res.status(400).json({message: 'Missing required fields'}) 
    : next()
}

function validateAction (req, res, next) {
    const { body } = req;
    const actionInfo = Object.keys(body);

    actionInfo.length === 0 || actionInfo === {} ?
    res.status(404).json({message: 'Missing action data'})
    : !body.description && !body.notes || body.description && body.notes === '' ?
    res.status(400).json({message: 'Missing required fields'})
    : next()
}

function validateActionId (req, res, next) {
    const { id } = req.params;
    actionsDb.get(id)
        .then(action => {
            if (action) {
                req.action = action
                next()
            } else {
                res.status(404).json({message: 'The action with the specified ID does not exist '})
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: 'There was an error validating the action'})
        })
}

