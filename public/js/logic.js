$(function() {

$(".add-saved").on("click", function(event){
  var articleId = $(this).data("id");
  var that = this;
  $.post(`/articles/${articleId}/save`)
  .done(
    function(data){
      $(that).parent().parent().remove();
    }
  );
});

$(".remove-saved").on("click", function(event){
  var articleId = $(this).data("id");
  var that = this;
  $.post(`/articles/${articleId}/remove`)
  .done(
    function(data){
      $(that).parent().parent().remove();
    }
  );
});

$(".view-notes").on("click", function(event){
  var articleId = $(this).data("id");

  $.get(`/articles/${articleId}`)
  .done(
    function(data){
      console.log(data);

      // open modal window
      $("#article-title").text(`Notes for Article '${data.title}'`);
      $("#article-id").text(`(ID: ${data._id})`);
      
      $("#article-notes").empty();
      data.notes.forEach(function(note){
        var noteDiv = $("<div>");

        var noteBody = $("<span>");
        noteBody.html(note.body);
        noteDiv.append(noteBody);

        noteDiv.append($("<br/>"));

        var removeBtn = $("<button>");
        removeBtn.attr("type", "button");
        removeBtn.data("noteid", note._id);
        removeBtn.addClass("remove-note");
        removeBtn.text("Remove Note");
        noteDiv.append(removeBtn);

        noteDiv.append($("<br/><br/>"));

        $("#article-notes").append(noteDiv);
      });

      $("#new-note").val("");
      $(".add-note").data("articleid", data._id);
      $("#articleModal").modal('toggle');
    }
  );

});

$(".add-note").on("click", function(event){
  event.preventDefault();

  var articleId = $(this).data("articleid");
  var notebody = $("#new-note").val().trim();
  
  if (notebody === ""){
    return false;
  }

  $.post(
      `/articles/${articleId}/addnote`,
      { body: notebody }
    )
  .done(
    function(data){
      console.log(data);
      $("#articleModal").modal('toggle');
    }
  );

});

$(document).on("click", ".remove-note", function(event) {
// $(".remove-note").on("click", function(event){
  var noteId = $(this).data("noteid");
  var that = this;
  $.post(`/deletenote/${noteId}`)
  .done(
    function(data){
      $(that).parent().remove();
    }
  )
});

});