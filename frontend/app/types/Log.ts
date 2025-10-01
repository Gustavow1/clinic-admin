export type Log = {
  id: string;
  requestTime: Date;
  responseTime: Date;
  method: string;
  url: string;
  statusCode: number;
  userAgent: string | null;
  body: any;
  params: object | any;
  query: object | any;
};
