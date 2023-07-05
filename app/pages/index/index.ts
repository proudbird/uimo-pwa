export function onLoginButtonClick(this: IndexView) {

  this.message = 'User login is not provided!';
  if(this.username) {
    this.message = `Hello, ${this.username}!`;
  }
}