/**
 * Custom http exception class to identify error message to send to response
 */
export class CustomHttpException {
  /**
   * @property statuscode - Http status code
   */
  statuscode: number;

  /**
   * @property message - Custom message to send to http response
   */
  message: string;

  /**
   * @property extraData - Extra data to send to http response
   */
  extraData: Record<string, any>;

  constructor(
    statuscode: number,
    message: string,
    extraData: Record<string, any> = {}
  ) {
    this.statuscode = statuscode;
    this.message = message;
    this.extraData = extraData;
  }
}
