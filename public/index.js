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

// button click event for saving an article
$(document).on('click', '.save', function(){
    let savedID = $(this).attr('data-id');
    let thisURL = '/save/'+savedID;
    $.get(thisURL, function(data, error){
        if (error) { console.log(error) }
        saved.push(data);
    })
    .then(function(){
        alert('This article has been saved!')
    });
});

/* SAVED PAGE FUNCTIONALITY */

// render saved articles
$.get('/articles', function(data){
    for (let i=0; i < data.length; i++) {
        // loop through all articles and check if the id of an article is present in the saved array, if it is, render the article
        if (data[i]._id === saved[i]._id) { 
            $('#savedArticles').append(`<div class="card mb-3">
                <div class="row no-gutters">
                <div class="col-md-4 scrape-image" style="background-image:url('${saved[i].image}');">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${saved[i].title}</h5>
                    <p class="card-text">${saved[i].category}</p>
                    <button class="btn btn-primary comment" data-toggle="modal" data-target="#${saved[i]._id}Modal" data-id=${saved[i]._id}>Comments</button> <button class="btn btn-secondary commentdelete" data-id="${saved[i]._id}">X</button>
                    </div>
                </div>
                </div>
            </div>
            
            <!-- Modal -->
                <div class="modal fade" id="${saved[i]._id}" tabindex="-1" role="dialog" aria-labelledby="commentModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Comments on this article.</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    <div class="notes" data-id="${saved[i]._id}Modal"></div>
                    <textarea class="form-control" aria-label="With textarea" placeholder="Add a comment of your own"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary commentSubmit" data-id="${saved[i]._id}">Submit</button> 
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
                </div>`)
            }
        // if there are comments, append them to the modal
        if (data[i].comment) {
            $(`${data[i]._id}Modal`).append(
                `<div data-id="${data[i]._id}" class="comment"><h5>${data[i].title}</h5>
                <p>${data[i].body}</p></div<hr>`
            );
        }
    }
});

// on click functionality to display an article's comments
$(document).on('click', '.comment', function(){
    let commentID = $(this).attr('data-id');

});

});