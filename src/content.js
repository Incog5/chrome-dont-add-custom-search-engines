
// Add an extra child input to any form that only has one
function spoilFormGet(elem) {
    console.info({Found: elem});

    // Check action - autodetection requires an HTTP* URL, but the scheme
    // is not necessarily present in @action as CSS sees it.
    const RE = /^http/i;
    if( !RE.test(elem.getAttribute('action')) && !RE.test(elem.action) ) {
        return;
    }

    // Autodetection requires exactly one input of type text or search.
    // If the type is unspecified (not[type]), it defaults to `text`.
    if(elem.querySelectorAll(':scope input:-webkit-any([type="text" i],[type="search" i],:not([type]))').length !== 1) return;

    // Autodetection also requires no password, file, or textarea elements
    if(elem.querySelector(':scope :-webkit-any(input[type="password" i],input[type="file" i],textarea)')) return;

    // Spoil the form so it won't be autodetected.  Do this by adding
    // a <textarea> - unlike <input>, it doesn't block implicit submission
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
    document.querySelectorAll('form:-webkit-any([method="get" i],:not([method]))').forEach(spoilFormGet);

} //main

document.addEventListener('DOMContentLoaded', main);

// vi: set ts=4 sts=4 sw=4 et ai: //
