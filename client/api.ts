import { createClient } from "lakebed/client";
import type app from "../server/index";
export const client = createClient<typeof app>({ optimistic: false });
