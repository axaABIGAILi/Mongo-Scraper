$(document).ready(function (){

/* VARIABLE DECLARATIONS */
var saved = [];

/* HOME PAGE FUNCTIONALITY */

// get all of the data from our articles route
$.get('/scrape', function(data){
    // loop over data array to append to #scrapes column
    for (var i = 0; i < data.length; i++) {
        $('#scrapes').append(`<div class="card mb-3">
        <div class="row no-gutters">
          <div class="col-md-4 scrape-image" style="background-image:url('${data[i].image}');">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${data[i].title}</h5>
              <p class="card-text">${data[i].category}</p>
              <button class="btn btn-primary save" data-id=${data[i]._id}>Save Article</button>
            </div>
          </div>
        </div>
      </div>`);
    }
});

// button click event for scraping articles
$(document).on('click', '#newArticles', function(){
    console.log($(this));
});

// button click event for saving an article
$(document).on('click', '#save', function(){
    let savedID = $(this).attr('data-id');
    let thisURL = '/save/'+savedID;
    $.get(thisURL, function(data, error){
        if (error) { console.log(error) }
        saved.push(data);
    });
});

/* SAVED PAGE FUNCTIONALITY */

$.get('/articles', function(data){
    for (let i=0; i < saved.length; i++) {
        $('#savedArticles').append(`<div class="card mb-3">
        <div class="row no-gutters">
        <div class="col-md-4 scrape-image" style="background-image:url('${saved[i].image}');">
        </div>
        <div class="col-md-8">
            <div class="card-body">
            <h5 class="card-title">${saved[i].title}</h5>
            <p class="card-text">${saved[i].category}</p>
            <button class="btn btn-primary comment">Comment</button> <button class="btn btn-secondary commentdelete" data-id="${saved[i]._id}">X</button>
            </div>
        </div>
        </div>
    </div>`)
    }
});

});