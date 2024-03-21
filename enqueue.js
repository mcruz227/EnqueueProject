var ascending = false;

async function fetchVideoData(){

}

fetchVideoData();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("dropdown-order").addEventListener("click", flipOrder);
  });

function flipOrder(){
    var dropdownOrder = document.getElementById("dropdown-order");

    if(ascending){
        dropdownOrder.style.transform = "rotate(0deg)";
        dropdownOrder.title="Descending";
        ascending = false;
    }else{
        dropdownOrder.style.transform = "rotate(180deg)";
        dropdownOrder.title="Ascending";
        ascending = true;
    }
}