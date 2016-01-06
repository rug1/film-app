console.log('javascript');

var request = new XMLHttpRequest();
var filmArray = [];
var plots = [];

function loadFilms () {
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      // console.log('RESPONSE TEXT',request.responseText);
      if (request.responseText !== 'error') {
        var filmObj = JSON.parse(request.responseText);
        filmArray.push(filmObj);
        if (filmArray.length === 10) {
          // console.log('FILM ARRAY', filmArray);
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
      // console.log('HTML OF FILMS',films);
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
        // console.log('£££££££££', request.responseText);
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

// FILTER MENU

(function(window) {
  'use strict';

  /*** Extend Object helper function.*/
  function extend(a, b) {
    for(var key in b) {
      if(b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /** * Each helper function.*/
  function each(collection, callback) {
    for (var i = 0; i < collection.length; i++) {
      var item = collection[i];
      callback(item);
    }
  }

  /*** Menu Constructor.*/
  function Menu(options) {
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }

  /*** Menu Options.*/
  Menu.prototype.options = {
    wrapper: '#o-wrapper',          // The content wrapper
    type: 'slide-left',             // The menu type
    menuOpenerClass: '.c-button',   // The menu opener class names (i.e. the buttons)
    maskId: '#c-mask'               // The ID of the mask
  };

  /*** Initialise Menu.*/
  Menu.prototype._init = function() {
    this.body = document.body;
    this.wrapper = document.querySelector(this.options.wrapper);
    this.mask = document.querySelector(this.options.maskId);
    this.menu = document.querySelector('#c-menu--' + this.options.type);
    this.closeBtn = this.menu.querySelector('.c-menu__close');
    this.menuOpeners = document.querySelectorAll(this.options.menuOpenerClass);
    this._initEvents();
  };

  /*** Initialise Menu Events.*/
  Menu.prototype._initEvents = function() {
    // Event for clicks on the close button inside the menu.
    this.closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      this.close();
    }.bind(this));

    // Event for clicks on the mask.
    this.mask.addEventListener('click', function(e) {
      e.preventDefault();
      this.close();
    }.bind(this));
  };

  /*** Open Menu.*/
  Menu.prototype.open = function() {
    this.body.classList.add('has-active-menu');
    // this.wrapper.classList.add('has-' + this.options.type);
    this.menu.classList.add('is-active');
    this.mask.classList.add('is-active');
    this.disableMenuOpeners();
  };

  /*** Close Menu.*/
  Menu.prototype.close = function() {
    this.body.classList.remove('has-active-menu');
    // this.wrapper.classList.remove('has-' + this.options.type);
    this.menu.classList.remove('is-active');
    this.mask.classList.remove('is-active');
    this.enableMenuOpeners();
  };

  /*** Disable Menu Openers.*/
  Menu.prototype.disableMenuOpeners = function() {
    each(this.menuOpeners, function(item) {
      item.disabled = true;
    });
  };

  /*** Enable Menu Openers.*/
  Menu.prototype.enableMenuOpeners = function() {
    each(this.menuOpeners, function(item) {
      item.disabled = false;
    });
  };

  /*** Add to global namespace.*/
  window.Menu = Menu;
})(window);

var slideLeft = new Menu({
  wrapper: '#o-wrapper',
  type: 'slide-left',
  menuOpenerClass: '.c-button',
  maskId: '#c-mask'
});

var slideLeftBtn = document.getElementById('filterIcon');

slideLeftBtn.addEventListener('click', function(e) {
  e.preventDefault();
  console.log('CLICKED!');
  slideLeft.open();
});
