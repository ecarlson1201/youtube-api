const APIKEY = 'AIzaSyCjQeMa3AVf38yIkwZAu3icqvSpxwGhmfw';

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

let nextPageData = '';

function getDataFromApi(searchTerm, callback) {
    const query = {
        part: 'snippet',
        q: searchTerm,
        key: APIKEY,
        maxResults: 6,
    }
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback)
}

function getPageFromApi(searchTerm, callback, nextPage) {
    const query = {
        part: 'snippet',
        q: searchTerm,
        key: APIKEY,
        maxResults: 6,
        pageToken: nextPage
    }
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback)
}

function renderResult(result) {
    return `
    <div>
        <h2>
        <a class='js-result-name' href='https://www.youtube.com/watch?v=${result.id.videoId}' target='_blank'>${result.snippet.title}</a></h2>
        <a class='js-result-name' href='https://www.youtube.com/channel/${result.snippet.channelId}' target='_blank'>${result.snippet.channelTitle}</a><br>
        <img src='${result.snippet.thumbnails.medium.url}' height='90' width='120'>
    </div><br>
    `;
}

function renderButtons() {
    return `
    <button id="js-prev">Prev Page</button><button onclick="getPageFromApi()" id="js-next">Next Page</button>
    `;
}

function displayYoutubeSearchData(data) {
    console.log(data);
    nextPageData = data.nextPageToken;
    const results = data.items.map((item, index) => renderResult(item));
    $('.js-search-results').html(results);
    $('.js-nav-buttons').html(renderButtons());
}

function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();

        queryTarget.val('');
        getDataFromApi(query, displayYoutubeSearchData);
    });
}

$(watchSubmit);