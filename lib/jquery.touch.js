$.fn.touch = function() {
    var original = this.css("backgroundColor");

    this.stop().pulse( { 
      backgroundColor: ['red', 'yellow', 'green', 'yellow', 'blue', 'yellow', 'red'], opacity: [0, 1] }); 
    }, 100).animate( {
      backgroundColor: original
    }, 1500);
};
