var request = new XMLHttpRequest();

function loadFilms () {
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      var filmObj = JSON.parse(request.responseText);
      console.log(filmObj);
      domManipulation(filmObj);
    }
  };
  request.open("GET", "/loadFilms");
  request.send();
}
loadFilms();

function domManipulation(filmObj) {
  var template = '<li><div class="img"><img src="' + filmObj.Poster + '"></div><div class="filmTitle">' + filmObj.Title + '</div><div class="filmRating">' + filmObj.imdbRating + '</div><div class="like"></div><div class="dislike"></div></li>';
  document.getElementById('films').innerHTML = template;
  document.getElementById('filmBio').innerHTML = filmObj.Plot;
  jTinder();
}

function jTinder () {
  /**
   * jTinder initialization
   */
  $("#tinderslide").jTinder({
  	// dislike callback
      onDislike: function (item) {
        console.log('dislike');
  	    // set the status text
          $('#status').html('Dislike image ' + (item.index()+1));
      },
  	// like callback
      onLike: function (item) {
        console.log('like');
  	    // set the status text
          $('#status').html('Like image ' + (item.index()+1));
      },
  	animationRevertSpeed: 200,
  	animationSpeed: 400,
  	threshold: 1,
  	likeSelector: '.like',
  	dislikeSelector: '.dislike'
  });

  /**
   * Set button action to trigger jTinder like & dislike.
   */
  $('.actions .like, .actions .dislike').click(function(e){
  	e.preventDefault();
  	$("#tinderslide").jTinder($(this).attr('class'));
  });
}
