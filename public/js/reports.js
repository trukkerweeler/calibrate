import { loadHeaderFooter, myport } from './utils.mjs';

loadHeaderFooter()
const port = myport();
let copyrightYear = new Date().getFullYear();

const deviceUrl = `http://localhost:${port}/device`;




