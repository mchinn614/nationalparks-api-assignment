'use strict'

/*App will take input from user for the number of states and the maximum number of results

Based on the user input, the app will call National Parks API and render name, description, address, and website url results on page
*/

//from user input, create api url with query parameters
function formatQueryUrl(queryParam){
  const npsApi = 'https://developer.nps.gov/api/v1/parks?';
  const queryString = Object.keys(queryParam).map(key=>encodeURIComponent(key)+'='+encodeURIComponent(queryParam[key])).join('&');
  return npsApi + queryString


};

//get results based on user input using fetch function. check if call is successful, if true, display results. if not, display error mesasge
function getResults(stateCode,maxResults=10){
  const param = {
    api_key:'4sC0qMZ7q0QFCeSm8v2zJIlMHughxVfGNZU3Np77',
    stateCode:stateCode,
    limit:maxResults,
    fields:'addresses'
  }
  const url = formatQueryUrl(param);
  console.log(url)
  fetch(url)
  .then(response => {
    if(response.ok){
      return response.json();
    }
    throw new Error(response.statusText)
  })
  .then(responseJson=>displayResults(responseJson))
  .catch(error=>$('.results-list').text(error.message))

};

//parse address
function parseAddress(addressJson){
  return (addressJson.line1 + '\n' + addressJson.line2 + '\n' +
          addressJson.city + ', ' + addressJson.stateCode + '\n' + 
          addressJson.postalCode)
}

// display results of API call
function displayResults(responseJson){
  $('.results-list').empty();
  if (responseJson.total === 0){
    $('.results-list').text('No results for state listed. Try another state.')
  }
  else {
      var i
      for (i=0;i<responseJson.data.length;i++){
        $('.results-list').append(`<h3><a href =${responseJson.data[i].url}>${responseJson.data[i].fullName}</a></h3>`)
        var j
        for (j=0;j<responseJson.data[i].addresses.length;j++){
          if (responseJson.data[i].addresses[j].type==='Physical'){
            var addressString = parseAddress(responseJson.data[i].addresses[j])
          }
        }
        $('.results-list').append(`<h4>${addressString}<h4>`)
        $('.results-list').append(`<p>${responseJson.data[i].description}</p>`)
      }
  }
  $('section').removeClass('hidden')
};

//watch for submit button then get values
function watchSubmit(){
  $('form').on('submit',event=>{
    event.preventDefault();
    const stateCode = $('.state-code').val();
    const maxResults = $('.max-results').val();
    getResults(stateCode,maxResults)
  });
  
};

$(watchSubmit);