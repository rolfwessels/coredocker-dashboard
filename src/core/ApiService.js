// @flow strict

class ApiService  {

    jsonFetch(fetch) {
      return fetch.then(response => {
        if (response.ok) {
          return response;
        } else {

          return response.json().then(errorMessage=>{
            let error = new Error(errorMessage.error);
            error.full = errorMessage;
            console.error(`Error in fetch: ${response.status} ${errorMessage.error} ${errorMessage.error_description}`);
            throw(error);
          });
        }
      })
      .then(response => {
        return response.json();
      });
    }
}

export default ApiService;
