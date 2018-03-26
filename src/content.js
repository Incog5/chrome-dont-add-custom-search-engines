
// Add an extra child input to any form that only has one
function spoilFormGet(elem) {
 console.info({Found: elem});

 // Autodetection requires exactly one input of type text or search
 if(elem.querySelectorAll(':scope input:-webkit-any([type="text" i],[type="search" i])').length !== 1) return;

 // Autodetection also requires no password, file, or textarea elements
 if(elem.querySelector(':scope :-webkit-any(input[type="password" i],input[type="file" i],textarea)')) return;

 // Add a <textarea> - unlike <input>, it doesn't block implicit submission
 // per https://www.tjvantoll.com/2013/01/01/enter-should-submit-forms-stop-messing-with-that/
 var newelem;
 newelem = document.createElement('textarea');
 newelem.name = 'chrome_dont_add_custom_search_engines_srsly';
 newelem.style.display='none';
 elem.appendChild(newelem);

 console.info({Spoiled: elem});
} //spoilFormGet

function main() {

 // OpenSearch - e.g., https://martin-thoma.com/search-engine-autodiscovery/
 // Uses CSS4 selectors, Chrome 49+
 document.querySelectorAll('[type="application/opensearchdescription+xml" i]').forEach(
  function (it) {
   it.removeAttribute('type');
   // console.info({"Spoiled by type removal": it});
  }
 );

 // Suggestion service, https://www.chromium.org/tab-to-search
 document.querySelectorAll('url[rel="suggestions" i]').forEach(
  function (it) {
   it.removeAttribute('rel');
   // console.info({"Spoiled by rel removal": it});
  }
 );

 // Chrome autodetection, https://www.chromium.org/tab-to-search #2
 if(!/\/.+\//.test(location.pathname)) {
  // Note: for the sake of efficiency, assumes that we're on Web pages,
  // i.e., that action="/..." indicates http or https.
  document.querySelectorAll('form:-webkit-any([method="get" i],:not([method])):-webkit-any([action^="http" i],[action^="/"])').forEach(spoilFormGet);
}

} //main

document.addEventListener('DOMContentLoaded', main);

// vi: set ts=1 sts=1 sw=1 et ai: //
