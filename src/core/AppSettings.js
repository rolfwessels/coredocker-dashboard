// @flow

export default class AppSettings {

  prop: url = "";

  ApiEndPoint() {
    if (!AppSettings._storedUrl) {
      const url = new URL(window.location.href);
      if (url.origin === 'http://localhost:3000') {
        AppSettings._storedUrl = 'http://localhost:5000';
      } else {
        AppSettings._storedUrl = url.origin;
      }
    }
    return AppSettings._storedUrl;
  }

  BuildUrl(url: string) {
    return AppSettings.CombineUrl(AppSettings.ApiEndPoint, url);
  }

  CombineUrl(base: string, path: string) {
    return (base + '/' + path).replace(/([^:])\/\//g, '$1/');
  }
}
