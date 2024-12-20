import type { NextFunction, Request, RequestHandler, Response } from 'express';

type ApiKeyConfig = {
  validApiKeys: { client: string; key: string }[];
};

export const validateApiKey = (config: ApiKeyConfig): RequestHandler => {
  const headerName = 'X-API-Key';

  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header(headerName);

    if (!apiKey) {
      res.status(401).json({
        error: 'API key is missing',
        message: `Please provide an API key using the '${headerName}' header`,
      });
      return;
    }

    if (!config.validApiKeys.find((it) => it.key === apiKey)) {
      res.status(403).json({
        error: 'Invalid API key',
        message: 'The provided API key is not valid',
      });
      return;
    }

    next();
  };
};
