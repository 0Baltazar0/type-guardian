import { ExtraYamlStuff, YamlDict } from "../schema/interface";

type BasicAuth = { type: "http"; scheme: "basic" } & YamlDict;
type BearerAuth = {
  type: "http";
  scheme: "bearer";
  bearerFormat?: string;
} & YamlDict;
type ApiAuth = {
  type: "apiKey";
  in: "header" | "query" | "cookie";
  name: string;
} & YamlDict;

type Scopes = { [key: string]: string };
type OFlow = {
  authorizationCode: {
    authorizationUrl: string;
    tokenUrl: string;
    scopes: Scopes;
    refreshUrl?: string;
  };
  implicit: {
    authorizationUrl: string;
    scopes: Scopes;
    refreshUrl?: string;
  };
  password: {
    tokenUrl: string;
    scopes: Scopes;
    refreshUrl?: string;
  };
  clientCredentials: {
    tokenUrl: string;
    scopes: Scopes;
    refreshUrl?: string;
  };
};
type OauthAuth = { type: "oauth2"; flows: OFlow } & YamlDict;

type OIDCAuth = {
  type: "openIdConnect";
  openIdConnectUrl: string;
};

export type SecuritySchema =
  | BasicAuth
  | BearerAuth
  | ApiAuth
  | OauthAuth
  | OIDCAuth;

export type SecurityRequirements = { [key: string]: string[] } & ExtraYamlStuff;
