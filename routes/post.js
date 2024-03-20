const express = require("express");
const userController = require('../controllers/user');
const materialController = require('../controllers/material');
const projectController = require('../controllers/project');
const skillController = require('../controllers/skill');
const userMaterialController = require('../controllers/userMaterial');
const userProjectController = require('../controllers/userProject');
const userSkillController = require('../controllers/userSkill');

const router = express.Router();

///////// user routes
router.get('/users/', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users/', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

//////// meterial routes
router.get('/materials/', materialController.getAllMaterials);
router.get('/materials/:id', materialController.getMaterialByID);
router.post('/materials/', materialController.createMaterial);
router.put('/materials/:id', materialController.updateMaterial);
router.delete('/materials/:id', materialController.deleteMaterial);


///////// project routes
router.get('/projects/', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectByID);
router.post('/projects/', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);


//////// skill routes
router.get('/skills/', skillController.getAllSkills);
router.get('/skills/:id', skillController.getSkillByID);
router.post('/skills/', skillController.createSkill);
router.put('/skills/:id', skillController.updateSkill);
router.delete('/skills/:id', skillController.deleteSkill);


///// userMaterial routes
router.post('/user/materials', userMaterialController.addMaterialToUser);
router.get('/user/:user_id/materials', userMaterialController.getMaterialsByUser);
router.put('/user/materials', userMaterialController.updateMaterialQuantityForUser);
router.delete('/user/:user_id/materials/:material_id', userMaterialController.deleteMaterialFromUser);


///// userProject routes 
router.post('/user/projects', userProjectController.addProjectToUser);
router.get('/user/:user_id/projects', userProjectController.getProjectsByUser);
router.delete('/user/:user_id/projects/:project_id', userProjectController.deleteProjectFromUser);

///// userSkill routes
router.post('/user/skills', userSkillController.addSkillToUser);
router.get('/user/:user_id/skills', userSkillController.getSkillsByUser);
router.delete('/user/:user_id/skills/:skill_id', userSkillController.deleteSkillFromUser);


module.exports = router;
