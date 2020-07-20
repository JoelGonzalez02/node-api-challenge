const express = require('express');
const projectsDb = require('../data/helpers/projectModel.js');
const actionsDb = require('../data/helpers/actionModel');
const router = express.Router();
const { validateProjectId, validateProject, validateAction, validateActionId } = require('../middleware');

router.post('/', validateProject, async (req, res) => {

    const { body } = req;

    try {
        if (body.name && body.description) {
            const newProject = await projectsDb.insert(body)
            res.status(201).json(newProject)
        } else {
            res.status(400).json({message: 'Please enter a valid name and description for the project'})
        }
    } catch {
        res.status(500).json({errorMessage: 'There was a problem adding your project to the database'})
    }
})

router.post('/:id/actions', validateAction, async (req, res) => {
    try {
        const { id } = req.params;
        const action = {project_id: id, description: '', notes: '', ...req.body}
        const project = await projectsDb.get(id);

        if (project) {
            if (action.description && action.notes !== '') {
                const newAction = await actionsDb.insert(action)
                res.status(201).json(newAction)
            } else {
                res.status(400).json({message: 'Please enter a valid description and notes for the action'})
            }
        } else {
            res.status(404).json({message: 'The project with the specified ID does not exist'})
        }
    } catch {
        res.status(500).json({errorMessage: 'There was a problem adding the action to the project'})
    }
})

router.get('/', async (req, res) => {

    try {
        const projects = await projectsDb.get()

        if (projects.length > 0) {
            res.status(200).json(projects)
        } else {
            res.status(404).json({message: 'There are no projects to retrieve'})
        }
    } catch {
        res.status(500).json({errorMessage: 'There was a problem with the database'})
    }
})

router.get('/:id', validateProjectId, async (req, res) => {

    try {
        const { id } = req.params;
        const project = await projectsDb.get(id);

        project ? res.status(200).json(project) 
        : res.status(404).json({message: 'The project with the specified ID does not exist'})
    } catch {
        res.status(500).json({errorMessage: 'There was a problem getting the project from the database'})
    }
}) 

router.get('/:id/actions', validateActionId, async (req, res) => {

    try {
        const { id } = req.params;
        const actions = await projectsDb.getProjectActions(id);

        actions ? res.status(200).json(actions) 
        : res.status(404).json({message: 'There are no actions for this project'})

    } catch {
        res.status(500).json({errorMessage: 'There was a problem getting the actions from the database'})
    }
})

router.delete('/:id', validateProjectId, async (req, res) => {
    const { id } = req.params;
    const deletedProject = await projectsDb.remove(id);

    deletedProject ? res.status(200).json(deletedProject)
    : res.status(404).json({message: 'The project with the specified ID does not exist'})
})

router.put('/:id', validateProjectId, async (req, res) => {
    const projectInfo = req.body;
    const { id } = req.params;
    const project = await projectsDb.get(id);

    try {

        if(project){
            if(projectInfo.name && projectInfo.description) {
                const editProject = await projectsDb.update(id, projectInfo)
                res.status(200).json(editProject)
            } else {
                res.status(400).json({message: 'Please enter a valid name and description to edit the post'})
            }
        } else {
            res.status(404).json({message: 'The project with the specidied ID does not exist'})
        }
    } catch {
        res.status(500).json({errorMessage: 'There was a problem updating your project'})
    }
})

module.exports = router;