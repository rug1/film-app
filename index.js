var request = new XMLHttpRequest();
var filmArray = [],
    plots = [];

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

document.getElementById('userIcon').addEventListener("click", function(){
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      if (request.responseText !== 'error') {
        console.log('GET WATCHLIST FROM DB>>>>>>>>', JSON.parse(request.responseText));
      } else {
        alert('There was an error. Please try again.');
      }
    }
  };
  request.open("GET", "/getWatchList");
  request.send();
});

var filterOptions = [
  romance     = document.getElementById('romance').innerHTML.toLowerCase(),
  thriller    = document.getElementById('thriller').innerHTML.toLowerCase(),
  crime       = document.getElementById('crime').innerHTML.toLowerCase(),
  drama       = document.getElementById('drama').innerHTML.toLowerCase(),
  mystery     = document.getElementById('mystery').innerHTML.toLowerCase(),
  biography   = document.getElementById('biography').innerHTML.toLowerCase(),
  animation   = document.getElementById('animation').innerHTML.toLowerCase(),
  adventure   = document.getElementById('adventure').innerHTML.toLowerCase(),
  family      = document.getElementById('family').innerHTML.toLowerCase()
];

filterOptions.forEach(filterFilms);

function filterFilms (element, index, array) {
  document.getElementById(element).addEventListener("click", function(){
    var chosenFilter = this.innerHTML;
    filmArray = [];
    requestFilterFilms(chosenFilter);
  });
}

function requestFilterFilms (chosenFilter) {
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      if (request.responseText !== 'error') {
        var filteredFilmObj = JSON.parse(request.responseText);
        filmArray.push(filteredFilmObj);
        if (filmArray.length === 10) {
          domManipulation(filmArray);
        } else {
          requestFilterFilms(chosenFilter);
        }
      } else {
        alert('There was an error. Please try again');
      }
    }
  };
  request.open("GET", "/" + chosenFilter + "FilterOption");
  request.send();
  closeMenu();
}


function closeMenu() {
  document.body.classList.remove('has-active-menu');
  document.getElementById('c-menu--slide-left').classList.remove('is-active');
  document.getElementById('c-mask').classList.remove('is-active');
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

// -------------- FILTER MENU ---------------------

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
  slideLeft.open();
});
