const APIKEY = 'AIzaSyCjQeMa3AVf38yIkwZAu3icqvSpxwGhmfw';

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

function getDataFromApi (searchTerm, callback) {
    const query = {
        part: 'snippet',
        q: searchTerm,
        key: APIKEY,
        per_page: 5,
    }
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback)
}

function renderResult(result) {
    return `
    <div>
        <h2>
        <a class='js-result-name' href='${result.html_url}' target='_blank'>${result.name}</a>
    </div>
    `;
}

function displayYoutubeSearchData (data) {
    const results = data.items.map((item, index) => renderResult(item));
    $('.js-search-results').html(results);
}

function watchSubmit (){
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();

        queryTarget.val('');
        getDataFromApi(query, displayYoutubeSearchData);
    });
}

$(watchSubmit);