import { fetchData, postData, deleteData, patchData } from "./api-helper";

const PROJECTS_API = "projects";

export const getAllProjects = () => fetchData(PROJECTS_API);

export const deleteProject = (id) => deleteData(`${PROJECTS_API}/${id}`);

export const updateProject = (id, data) => patchData(`${PROJECTS_API}/${id}`, data);

export const addProject = (newProjectData) => postData(PROJECTS_API, newProjectData);
