const APIKEY = 'AIzaSyCjQeMa3AVf38yIkwZAu3icqvSpxwGhmfw';

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

let query = '';
let nextPageFunc = null;
let prevPageFunc = null;
let searchData = '';
let clicked = '';

const MODAL = $("#myModal");
const PLAYER = $('iframe');

function getDataFromApi(searchTerm, callback) {
    const query = {
        part: 'snippet',
        q: searchTerm,
        key: APIKEY,
        maxResults: 3,
    }
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback)
}

function getPageFromApi(searchTerm, callback, nextPage) {
    const query = {
        part: 'snippet',
        q: searchTerm,
        key: APIKEY,
        maxResults: 3,
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
        <img class="js-thumbnail" src='${result.snippet.thumbnails.medium.url}' height='90' width='120'>
    </div><br>
    `;
}

function renderButtons() {
    return `
    <button id="js-prev" onclick="prevPageFunc()">Prev Page</button><button onclick="nextPageFunc()" id="js-next">Next Page</button>
    `;
}

function displayYoutubeSearchData(data) {
    searchData = data
    nextPageFunc = function () {
        getPageFromApi(query, displayYoutubeSearchData, data.nextPageToken)
    }
    prevPageFunc = function () {
        getPageFromApi(query, displayYoutubeSearchData, data.prevPageToken)
    }
    const results = data.items.map((item, index) => renderResult(item));
    $('.js-search-results').html(results);
    $('.js-nav-buttons').html(renderButtons());
}


function renderModalVideo (){
    PLAYER.prop('src', `https://www.youtube.com/watch?v=${searchData.items[clicked].id.videoId}`)
}

function displayModal() {
    $('body').on('click', 'img', function (event) {
        MODAL.css('display', 'block')
        clicked = $('img').toArray().indexOf(event.target)
        renderModalVideo()
    });
    closeModal()
}

function closeModal() {
    $('span').click(function(){
        MODAL.css('display', 'none')
    });
    MODAL.click(function(){
        MODAL.css('display','none')
    }); 
}

function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        query = queryTarget.val();

        queryTarget.val('');
        getDataFromApi(query, displayYoutubeSearchData);
        $(displayModal);
    });
}

$(watchSubmit);