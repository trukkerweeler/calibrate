import { loadHeaderFooter, myport, getUserValue } from "./utils.mjs";

loadHeaderFooter();
const port = myport();
const user = await getUserValue();