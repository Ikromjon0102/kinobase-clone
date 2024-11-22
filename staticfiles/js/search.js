


function dynamicSearch(value){
  let url = 'search/';
  if(value.length > 2){
      fetch(url + `?data=${value}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // Work with the JSON data
          let movieResults = document.querySelector(".autocomplete-suggestions");
          movieResults.innerHTML = ''; // Clear previous results
          movieResults.style.display = "block";
          let result = '';
          for(let el of data.data){
              result += `
                  
                  <div class="autocomplete-suggestion" data-index="1">
                  <img src="/media/${el.cover}" width="35">
                  <div class="info">
                      <div class="title">
                      <span>
                      <a href="film/${el.slug}">${el.title}</a>
                      </span>
                      </div>
                      <span class="rating">${el.kp_rating}</span>
                      <span class="year">${el.year}, ${el.quality}</span>
                  </div>
                  </div>

              `;
            }
            movieResults.innerHTML = result; // Insert all results at once
          
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
  }
} 
