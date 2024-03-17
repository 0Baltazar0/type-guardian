import { ExtraYamlStuff, RefType } from "../schema/interface";
import { HeadersObject } from "../headers/interface";
import { LinkType } from "../links/interface";
import { ContentEntry } from "../requestBodies/interface";
export type TrueResponseType = {
  description: string;
  content?: ContentEntry;
  headers?: { [key: string]: HeadersObject };
  links?: { [key: string]: LinkType };
} & ExtraYamlStuff;
export type ResponsesType = TrueResponseType | RefType;
