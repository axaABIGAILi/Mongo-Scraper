$(document).ready(function (){

/* VARIABLE DECLARATIONS */
var saved = [];

/* PAGE FUNCTIONALITY */

// get all of the data from our articles route
$.get('/articles', function(data){
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
              <button class="btn btn-primary save" id=${data[i]._id}>Save Article</button>
            </div>
          </div>
        </div>
      </div>`)
    }
});

// button click event for scraping articles
$(document).on('click', '#newArticles', function(){
    console.log($(this));
});

// button click event for saving an article
$(document).on('click', '#save', function(){
    console.log($(this));
});

});