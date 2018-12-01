// @flow

let _storedUrl: string;

export default class AppSettings {
  static ApiEndPoint() {
    if (!_storedUrl) {
      //this is how we inject the environment variables
      if ('REPLACE_API_URL' && 'REPLACE_API_URL'.indexOf('REPLACE_API') === -1) {
        _storedUrl = 'REPLACE_API_URL';
        return _storedUrl;
      } else {
        const url = new URL(window.location.href);
        if (url.origin === 'http://localhost:3000') {
          _storedUrl = 'http://localhost:5000';
        } else {
          _storedUrl = url.origin;
        }
      }
    }
    return _storedUrl;
  }

  static BuildUrl(url: string): string {
    return AppSettings.CombineUrl(AppSettings.ApiEndPoint(), url);
  }

  static CombineUrl(base: string, path: string): string {
    return (base + '/' + path).replace(/([^:])\/\//g, '$1/');
  }
}
