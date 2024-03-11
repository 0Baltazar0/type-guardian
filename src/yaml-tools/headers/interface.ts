import { HeaderParameter } from "../parameters/interface";

export type HeadersObject = Omit<HeaderParameter, "name" | "in">;
