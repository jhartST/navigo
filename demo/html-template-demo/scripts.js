// getElementById wrapper
function $id(id) {
  return document.getElementById(id);
}


// asyncrhonously fetch the html template partial from the file directory,
// then set its contents to the html of the parent element
function loadHTML(url, id) {
  req = new XMLHttpRequest();
  req.open('GET', url);
  req.send();
  req.onload = () => {
    $id(id).innerHTML = req.responseText;
  };
}

// use #! to hash
router = new Navigo(null, true, '#!');


router.on(
  'story/:id',
  function (params, query) {
    loadHTML('./templates/story.html', 'view');
    console.log('Query string: ' + query);
  },
  {
    before: function (done, params) {
      // doing some async operation
      done();
    },
    after: function (params) {
      console.log(params.id);
    },
    leave: function (params) {
      // when you are going out of the that route
    }
  }
);

router.on(
  'search',
  function (params, query) {
    loadHTML('./templates/search.html', 'view');
    console.log(query);
  },
  {
    before: function (done, params) {
      done();
    },
    after: function (query) {
      console.log("I searched!");
      getArticleMeta(query);
    },
    leave: function (params) {
    }
  }
);

// set the default route
router.on(() => { $id('view').innerHTML = '<h2>Homepage</h2>'; });

// set the 404 route
router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

router.resolve();


function doAThing() {
  article = document.getElementById("article-search").value;
  router.navigate('search?' + article);
};

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

function getArticleMeta(query) {
    apiurl = 'http://analyticsapi.seattletimes.com/api/v.1.2/posts/lookup/';
    article = query;
    url = apiurl + btoa(article);
    fetch(url)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function(data) {
                    if (!isNaN(data)) {
                        console.log(data);
                        router.navigate('story/' + data);
                    } else {
                        console.log("error fetching value.  Response is: " + data);
                    }
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
};
