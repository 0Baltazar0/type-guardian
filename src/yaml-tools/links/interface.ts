type RefLinkType = {
  operationRef: string;
  parameters: { [key: string]: string };
  requestBody: string;
  description: string;
  server: "";
};
type IdLinkType = {
  operationId: string;
  parameters: { [key: string]: string };
  requestBody: string;
  description: string;
  server: "";
};

export type LinkType = RefLinkType | IdLinkType;
