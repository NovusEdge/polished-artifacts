import { readdirSync, existsSync } from "node:fs";

// A look is any skill folder with a tokens.css; core's look table must list the same set.
export const LOOKS = readdirSync("skills").filter(d => existsSync(`skills/${d}/tokens.css`));
