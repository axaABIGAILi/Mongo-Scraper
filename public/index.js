/* VARIABLE DECLARATIONS */
//var savedArticles = [];

$(document).ready(function (){

/* HOME PAGE FUNCTIONALITY */

// get all of the data from our articles route
$.get('/articles', function(data){
    // loop over data array to append to #scrapes column
    // limit to 12
    for (var i = 0; i < 12; i++) {
        if (data[i].isSaved != true) {
        $('#scrapes').append(`<div class="card mb-3">
        <div class="row no-gutters">
          <div class="col-md-4 scrape-image" style="background-image:url('${data[i].image}');">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title"><a class="scrapeLink" href="${data[i].url}">${data[i].title}</a></h5>
              <p class="card-text">${data[i].category}</p>
              <button class="btn btn-primary save" data-id=${data[i]._id}>Save Article</button>
            </div>
          </div>
        </div>
      </div>`);
        }
    }
}).catch(function(error){
    console.log(error)
});

// button click event for saving an article
$(document).on('click', '.save', function(){
    let savedID = $(this).data('id');
    //let thisURL = '/save/'+savedID;
    $.ajax({
        url: '/save/'+savedID,
        method: 'POST',
        data: true,
        success: function(data, status) {
            console.log(`Status: ${status}, data: ${data.isSaved}`);
            alert('Article saved!')
        },
        error: function(error) {
            console.log(`Error: ${error}`);
        }
    });
});

/* SAVED PAGE FUNCTIONALITY */

// render saved articles
$.get('/articles', function(data){
    console.log(data); 
   for (let i=0; i < data.length; i++) {
        // loop through all articles and check if the id of an article is present in the saved array, if it is, render the article
        if (data[i].isSaved) { 
            $('#savedArticles').append(`<div class="card mb-3" id="${data[i]._id}Card">
                <div class="row no-gutters">
                <div class="col-md-4 scrape-image" style="background-image:url('${data[i].image}');">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${data[i].title}</h5>
                    <p class="card-text">${data[i].category}</p>
                    <button class="btn btn-primary comment" data-toggle="modal" data-target="#${data[i]._id}Modal" data-id=${data[i]._id}>Comments</button> <button class="btn btn-secondary articledelete" type="submit" data-id="${data[i]._id}">X</button>
                    </div>
                </div>
                </div>
            </div>
            
            <!-- Modal -->
                <div class="modal fade" id="${data[i]._id}" tabindex="-1" role="dialog" aria-labelledby="commentModal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Latest comment on this article:</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    <div class="notes" id="${data[i]._id}Notes"></div><hr>
                    <input class="form-control mb-2" aria-label="With textarea" placeholder="Title" id="${data[i]._id}Title"></input>
                    <textarea class="form-control" aria-label="With textarea" placeholder="Add a comment of your own" id="${data[i]._id}Body"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary commentSubmit" data-id="${data[i]._id}">Submit</button> 
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
                </div>`)
            }
        // if there are comments, append them to the modal
        if (data[i].comment) {
            $(`#${data[i]._id}Notes`).append(
                `<div id="${data[i]._id}Comment" data-id="${data[i]._id}" class="comment"><h5>${data[i].title}</h5>
                <p>${data[i].body}</p></div><hr>`
            );
        }
    }
} );

// on click functionality to display an article's comments
$(document).on('click', '.comment', function(){
    let commentID = $(this).attr('data-id');
    console.log(commentID);
    $(`#${commentID}`).modal('toggle');
    // empty the div before repopulating it
    $(`#${commentID}Notes`).empty();
    $.get('/articles/'+commentID, function(data){
        console.log(data);
        //if (data.comment) {
           // for (let i=0; i < data.comment.length; i++) {
            $(`#${commentID}Notes`).append(`<h5>${data.comment.title}</h5>
            <p>${data.comment.body}</p> <button class="btn btn-secondary commentdelete" data-id=${data.comment._id} data-commentid="${commentID}" type="submit">X</button> <hr>`);
            }
       // } 
    //}
    )
    .then(function(data, err){
        if (err) {console.log(err)}
        console.log(data);
    });

});

// on click functionality to submit a new comment
$(document).on('click', '.commentSubmit', function(){
    let commentID = $(this).data('id');
    let newComment = {};
    newComment.title = $(`#${commentID}Title`).val();
    newComment.body = $(`#${commentID}Body`).val();
    console.log(newComment);

    $.ajax({
        url: '/articles/'+commentID,
        method: 'POST',
        data: newComment,
        success: function(data) {
            console.log(data)
        },
        error: function(err) {
            console.log(err)
        }
    })
    .then(function(){
        $(`#${commentID}Title`).val('');
        $(`#${commentID}Body`).val('');
        $(`#${commentID}`).modal('hide');
    });
    $(`#${commentID}Title`).val('');
    $(`#${commentID}Body`).val('');
    $(`#${commentID}`).modal('hide');
});

// on click functionality to delete a comment
$(document).on('click', '.commentdelete', function(){
    let deleteID = $(this).data('id');
    let modalID = $(this).data('commentid');
    $.ajax({
        url: '/delete/'+deleteID,
        method: 'DELETE'
    })
    .then(function(err){
        if(err) {console.log(err)} 
        $(`#${deleteID}Notes`).empty();
    });
    $(`#${modalID}`).modal('hide');
});

// on click functionality to delete an article
$(document).on('click', '.articledelete', function(){
    let deleteID = $(this).data('id')
    $.ajax({
        url: '/unsave/'+deleteID,
        method: 'PUT',
        data: {isSaved: false},
        success: function(data, status) {
            console.log(`Status: ${status}, data: ${data}`);
        },
        error: function(error) {
            console.log(`Error: ${error}`);
        }
    })
    // remove element from the dom
    $(`#${deleteID}Card`).remove();
});

});