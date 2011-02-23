jQuery.fn.touch = function() {
    var original = this.css("backgroundColor");

    this.stop().pulse( { 
      backgroundColor: ['red', 'yellow', 'green', 'yellow', 'orange', 'blue', 'yellow', 'red'], opacity: [0, 1] } ) 
    .animate( {
      backgroundColor: original
    }, 500);
};
