var request = new XMLHttpRequest();
var filmArray = [];
var plots = [];

function loadFilms () {
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      console.log('RESPONSE TEXT',request.responseText);
      if (request.responseText !== 'error') {
        var filmObj = JSON.parse(request.responseText);
        filmArray.push(filmObj);
        if (filmArray.length === 10) {
          console.log('FILM ARRAY', filmArray);
          domManipulation(filmArray);
        } else {
          loadFilms();
        }
      } else {
        alert('There was an error. Please try again');
      }
    }
  };
  request.open("GET", "/loadFilms");
  request.send();
}
loadFilms();

function domManipulation(filmArray) {
  var count = 0;
  var films = [];
  filmArray.forEach(addToDom);
  function addToDom (element, index, array) {
    count ++;
    var template = '<li><div class="img"><img src="' + element.Poster + '"></div><div class="filmTitle">' + element.Title + '</div><div class="filmRating">' + element.imdbRating + '</div><div class="like"></div><div class="dislike"></div></li>';
    films.push(template);
    var filmPlot = element.Plot;
    plots.push(filmPlot);
    if (count === filmArray.length) {
      console.log('HTML OF FILMS',films);
      document.getElementById('films').innerHTML = films;
      document.getElementById('filmBio').innerHTML = plots[filmArray.length-1];
      jTinder();
    }
  }
  // var template = '<li><div class="img"><img src="' + filmObj.Poster + '"></div><div class="filmTitle">' + filmObj.Title + '</div><div class="filmRating">' + filmObj.imdbRating + '</div><div class="like"></div><div class="dislike"></div></li>';
  // document.getElementById('films').innerHTML = template;
  // // document.getElementById('filmBio').innerHTML = filmObj.Plot;
  // jTinder();
}

function watchList () {
  document.getElementById('userIcon').addEventListener("click", function(){
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        console.log('£££££££££',request.responseText);
      }
    };
    request.open("GET", "/getWatchList");
    request.send();
  });
}


function jTinder () {
  var count = filmArray.length-1;
  $("#tinderslide").jTinder({
      onDislike: function (item) {
        count--;
        if (count === -1) {
          document.getElementById('filmBio').innerHTML = "Please refresh for more films";
        } else {
          document.getElementById('filmBio').innerHTML = plots[count];
        }
      },
      onLike: function (item) {
        count--;
        if (count === -1) {
          document.getElementById('filmBio').innerHTML = "Please refresh for more films";
        } else {
          document.getElementById('filmBio').innerHTML = plots[count];
          var img = (item[0].firstChild.innerHTML).split('"')[1];
          var title = item[0].firstChild.nextElementSibling.innerHTML;
          request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
              if (request.responseText === 'OK') {
                console.log(request.responseText);
              } else {
                alert('There was an error. Please try again');
              }
            }
          };
          request.open("GET", "/addToWatchlist" + "filmImg=" + img + "filmTitle=" + title);
          request.send();
        }
      },
  	animationRevertSpeed: 200,
  	animationSpeed: 400,
  	threshold: 1,
  	likeSelector: '.like',
  	dislikeSelector: '.dislike'
  });

  // BUTTONS
  // $('.actions .like, .actions .dislike').click(function(e){
  // 	e.preventDefault();
  // 	$("#tinderslide").jTinder($(this).attr('class'));
  // });
}
