export interface schemas {
  components: {
    ApplicationJson: {
      User: {};
    };
  };
}

export interface paths {
  "/example": {
    get: {
      requestBody: {
        content: {
          "application/json": schemas["components"]["ApplicationJson"]["User"];
        };
      };
    };
  };
}
