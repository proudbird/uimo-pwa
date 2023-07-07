export class ValueError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
