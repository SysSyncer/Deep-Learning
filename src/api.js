import axios from 'axios';
const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
export const saveExperiment = (data) => axios.post(`${base}/api/experiments`, data).then(r=>r.data);
export const fetchExperiments = () => axios.get(`${base}/api/experiments`).then(r=>r.data);
