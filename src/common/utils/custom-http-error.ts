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

  constructor(statuscode: number, message: string) {
    this.statuscode = statuscode;
    this.message = message;
  }
}
