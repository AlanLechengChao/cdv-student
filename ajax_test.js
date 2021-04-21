$(document).ready(function(){
  $.ajax({
    url: "http://www.heritage-architectures.com/",
    type: "GET",
    success: function(result){
      console.log(result);
    }
  })
})
