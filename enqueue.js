async function fetchVideoData(){

}

fetchVideoData();

document.addEventListener("DOMContentLoaded", function() {
  let sortBtn = document.querySelector('.sort-btn');
  let sortOptions = document.querySelector('.sort-options');

  sortBtn.addEventListener('click', function() {
    sortOptions.classList.toggle('show');
  });
});
