type ServerVariables = {
  enum?: string[];
  default: string;
  description?: string;
};
export type ServerObject = {
  url: string;
  description?: string;
  variables?: { [key: string]: ServerVariables };
};
