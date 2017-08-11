$(document).ready(function() {
    
    $('#launch').click(function() {
        $('#main').show();
        $('#launch').hide();
    });

    $.getJSON('/articles', function(articles) {
      console.log(articles.length);

        // Launch
        var counter = 0;
        $('#saveNote').attr('data-id', articles[counter]._id);
        $('#deleteNote').attr('data-id', articles[counter]._id);
        $('#articles').html("<h2>" + articles[counter].title + "</h2><p>" + articles[counter].summary + "</p>");
        $.ajax({
                method: "POST",
                dataType: "json",
                url: "/notes",
                data: {
                    _id: articles[counter].note
                }
            })
            .done(function(result) {
                if (result == null) {
                    $('#deleteNoteBox').val("");
                } else {
                    $('#deleteNoteBox').val(result.body);
                }
            });

        //Next article button
        $('#nextArticle').click(function() {
            $('#articles').empty();
            $('#deleteNoteBox').empty();
            counter = (counter + 1);
            if (counter > (articles.length - 1)) {
                counter = 0;
            }
            console.log(counter);
            $.getJSON('/articles', function(articles) {
                $('#articles').html("<h2>" + articles[counter].title + "</h2><p>" + articles[counter].summary + "</p>");
                $('#saveNote').attr('data-id', articles[counter]._id);
                $('#deleteNote').attr('data-id', articles[counter]._id);
                $.ajax({
                        method: "POST",
                        dataType: "json",
                        url: "/notes",
                        data: {
                            _id: articles[counter].note
                        }
                    })
                    .done(function(result) {
                        if (result == null) {
                            $('#deleteNoteBox').val("");
                        } else {
                            $('#deleteNoteBox').val(result.body);
                        }
                    });
            });
        });

        //Previous article button
        $('#previousArticle').click(function() {
            $('#articles').empty();
            $('#deleteNoteBox').empty();
            counter = (counter - 1);
            if (counter < 0) {
                counter = (articles.length - 1);
            }
            $.getJSON('/articles', function(articles) {
                $('#articles').html("<h2>" + articles[counter].title + "</h2><p>" + articles[counter].summary + "</p>");
                $('#saveNote').attr('data-id', articles[counter]._id);
                $('#deleteNote').attr('data-id', articles[counter]._id);
                $.ajax({
                        method: "POST",
                        dataType: "json",
                        url: "/notes",
                        data: {
                            _id: articles[counter].note
                        }
                    })
                    .done(function(result) {
                        if (result == null) {
                            $('#deleteNoteBox').val("");
                        } else {
                            $('#deleteNoteBox').val(result.body);
                        }
                    });
            });
        });

        //save article

         $('#saveArticle').click(function() {
            var articleSave = $(this).attr('#articles');


            $.ajax({
                    method: "POST",
                    dataType: "json",
                    url: "/saved",
                    data: articleSave
                })
                .done(function(data) {
                    console.log("article saved");
                   
                });
          
        });


        //Save note button
        $('#saveNote').click(function() {
            var thisId = $(this).attr('data-id');
            var body = $('#bodyinput').val();

            $.ajax({
                    method: "POST",
                    dataType: "json",
                    url: "/articles/" + thisId,
                    data: {
                        body: body
                    }
                })
                .done(function(data) {
                    console.log("note saved");
                    $('#deleteNoteBox').val(data.body);
                });
            $('#bodyinput').val("");
        });

        //Delete note button
        $('#deleteNote').click(function() {
            $.ajax({
                    method: "POST",
                    dataType: "json",
                    url: "/notes/delete/",
                    data: {
                        _id: articles[counter].note
                    }
                })
                .done(function(data) {
                    console.log("note deleted");
                });
            $('#deleteNoteBox').val("");
        });

    });

});
