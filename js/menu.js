$(document).ready(() => {

  $('#idsearchForm').hide();
  $('#titlesearchForm').show();
  $('#yearsearchForm').hide();
  $('#titlesearchText').focus().trigger({
    type: 'keypress',
    which: 13
  });
  $('#Busy').hide();

  /* reset  button */
  $(".reset").bind("click", function() {
    $("input[type=text], textarea").val("");
  });


  /* enter key submit for input box */
  $('#idsearchForm').on('submit', (e) => {
    let idsearchText = $('#idsearchText').val();
    let titlesearchText = "";
    let yearsearchText = "";
    if (idsearchText == "") {
      alert('enter the id');
    } else {
      getMovies(idsearchText, titlesearchText, yearsearchText);
    }
    e.preventDefault();
  });

  if ($("#yearsearchForm").is(":hidden")) {
    $('#titlesearchForm').on('submit', (e) => {
      let idsearchText = "";
      let yearsearchText = "";
      let titlesearchText = $('#titlesearchText').val();
      if (titlesearchText == "") {
        alert('enter the title');
      } else {
        getMovies(idsearchText, titlesearchText, yearsearchText);
      }
      e.preventDefault();
    });
  }

  $('#yearsearchForm').on('submit', (e) => {
    let idsearchText = "";
    let titlesearchText = $('#titlesearchText').val();
    let yearsearchText = $('#yearsearchText').val();
    if ($('#titlesearchText').val() == "") {
      alert('enter the tile');
    } else if ($('#yearsearchText').val() == "") {
      alert('enter the year');
    } else {
      getMovies(idsearchText, titlesearchText, yearsearchText);
    }
    e.preventDefault();
  });

  /* search button */
  $('#search').click((e) => {
    e.preventDefault();
    if ($("#idsearchForm").is(":visible")) {
      $('#idsearchForm').submit();
    }
    if ($("#titlesearchForm").is(":visible")) {
      $('#titlesearchForm').submit();
    }
    if ($("#yearsearchForm").is(":visible")) {
      $('#yearsearchForm').submit();
    }
  });

  /* radio button trigger */
  $("input[type='radio'][id='customRadioInline1']").click(function() {
    $('#titlesearchForm').hide();
    $('#yearsearchForm').hide();
    $('#idsearchForm').show();
    $("input[type=text], textarea").val("");
    $('#idsearchText').focus().trigger({
      type: 'keypress',
      which: 13
    });
  });

  $("input[type='radio'][id='customRadioInline2']").click(function() {
    $('#yearsearchForm').hide();
    $('#idsearchForm').hide();
    $('#titlesearchForm').show();
    $("input[type=text], textarea").val("");
    $('#titlesearchText').focus().trigger({
      type: 'keypress',
      which: 13
    });
  });

  $("input[type='radio'][id='customRadioInline3']").click(function() {
    $('#idsearchForm').hide();
    $('#titlesearchForm').show();
    $('#yearsearchForm').show();
    $("input[type=text], textarea").val("");
    $('#titlesearchText').focus().trigger({
      type: 'keypress',
      which: 13
    });
  });

  $('body').append('<div id="loadingDiv"><div class="loader">Loading...</div></div>');
});


/* loader */
$(window).on('load', function() {
  setTimeout(removeLoader, 700); //wait for page load PLUS half seconds.
});

/* remove loader */
function removeLoader() {
  $("#loadingDiv").fadeOut(700, function() {
    // fadeOut complete. Remove the loading div
    $("#loadingDiv").remove(); //makes page more lightweight
  });
}

/* error */
/* get all the movie */
function getMovies(idsearchText, titlesearchText, yearsearchText) {
  let Url = "";
  if (idsearchText) {
    Url = 'https://www.omdbapi.com/?i=' + idsearchText + '&apikey=3ca3b31f';
  } else {
    Url = 'https://www.omdbapi.com/?s=' + titlesearchText + '&y=' + yearsearchText + '&apikey=3ca3b31f';
  }
  $.ajax({
    type: 'GET',
    dataType: 'json',
    async: true,
    url: Url,
    success: (data) => {
      let response = data.Response;
      let output = '';
      if (response == "True") {
        let movies = data.Search;
        console.log(data);
        if (idsearchText) {
          output += `
        <div class="col-lg-4 col-md-6 d-flex justify-content-center align-items-start p-3">
          <div class="well text-white text-center card bg-dark">
            <img src="${data.Poster}" onerror="this.src='no_image_available.png';" class="img-fluid img-thumbnail">
              <h6 class="card-title mt-1 py-1">${data.Title}</h6>
            <a onclick="movieSelected('${data.imdbID}')" class="btn btn-primary m-1 b-0" href="#">Movie Details</a>
          </div>
        </div>
      `;
        } else {
          $.each(movies, (index, i) => {
            output += `
        <div class="col-lg-4 col-md-6 d-flex justify-content-center align-items-start p-3">
          <div class="well text-white text-center card bg-dark">
            <img src="${i.Poster}" onerror="this.src='no_image_available.png';" class="img-fluid img-thumbnail">
              <h6 class="card-title mt-1 py-1">${i.Title}</h6>
            <a onclick="movieSelected('${i.imdbID}')" class="btn btn-primary m-1 b-0" href="#">Movie Details</a>
          </div>
        </div>
      `;
          });
        }

      } else if (response == "False") {
        output += `<tr><td colspan="2" style="text-align: center; color:white;" class="m-5 p-5">Sorry No Result Found</td></tr>`;
      }
      $('#movies').html(output);
    },
    error: (data) => {

      alert("some error occured")

    },

    beforeSend: () => {
      $('#Busy').show();
    },
    complete: () => {
      $('#Busy').hide();
    },

    timeout: 9000
  });
}

/* set movie id */
function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

/* get movie details */
function getMovie() {
  let movieId = sessionStorage.getItem('movieId');
  $.ajax({
    type: 'GET',
    dataType: 'json',
    async: true,
    url: 'http://www.omdbapi.com?i=' + movieId + '&apikey=3ca3b31f',
    success: (response) => {
      console.log(response);
      $('.title').append(response.Title);
      $('.plot').append(response.Plot);
      $('.poster').append(() => {
        if ("N/A" == response.Poster) {
          $(".poster").html('<img src="no_image_available.png" class="img-fluid mt-3">');
        } else {
          $(".poster").html('<img src=" ' + response.Poster + ' " class="img-fluid mt-3">');
        }
      });
      $('.genre').append(response.Genre);
      $('.released').append(response.Released);
      $('.year').append(response.Year);
      $('.runtime').append(response.Runtime);
      $('.imdbRating').append(response.imdbRating);
      $('.director').append(response.Director);
      $('.actors').append(response.Actors);
      $('.writer').append(response.Writer);
      $('.production').append(response.Production);
      $('.country').append(response.Country);
      $('.language').append(response.Language);
      $('.awards').append(response.Awards);
      $('.type').append(response.Type);
      $('.boxOffice').append(response.BoxOffice);
    },
    error: (data) => {
      alert("some error occured")
    },
    timeout: 9000
  });

}
