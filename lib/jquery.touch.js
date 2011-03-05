jQuery.fn.touch = function() {
    var original = this.css("backgroundColor");

    this.stop().pulse( { 
      backgroundColor: ['red', 'green', 'blue', 'orange', 'black', 'red'], opacity: [0, 1] } ) 
    .animate( {
      backgroundColor: original
    }, 5000);
};
