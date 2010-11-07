function scrollToBottom() {
    window.scrollBy(0, document.body.scrollHeight - document.body.scrollTop);
};

function log(data, debug){
  output_log.innerHTML += data + "<br />";

  if (debug) {
    document.body.appendChild(prettyPrint(data));
  }
  scrollToBottom();
}
