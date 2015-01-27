function disableTossForm() {
  $("#toss_button").prop("disabled", true);
  $("#toss_box").prop("disabled", true);
  $("body").addClass("loading");
}

function enableTossForm() {
  $("#toss_button").prop("disabled", false);
  $("#toss_box").prop("disabled", false);
  $("body").removeClass("loading");
}

function deactivateSock() {
  sock.send(JSON.stringify({command: "deactivate"}));
}

function reactivateSock() {
  setTimeout(function(){
    if (!$("#toss_box").is(":focus")){
  sock.send(JSON.stringify({command: "activate"}));
    }
  }, 20000);
}

var sessionID;
var sock = new SockJS("/echo");
sock.onmessage = function(e) {
  var data = JSON.parse(e.data);
  if (data.id) sessionID = data.id;
  if (data.message) {
    deactivateSock();
    var message = marked(data.message);
    $("#message").html(message).removeClass("hidden");
    $("#message_screen").removeClass("hidden");
  }
};

window.onbeforeunload = function(){
  sock.close();
};

$(window).load(function(){
  $("#toss_form").submit(function(event){
    disableTossForm();
    $.post("toss", JSON.stringify({ id: sessionID, message: $("#toss_box").val() }) )
    .done(function() {
      $("#toss_box").val("");
      enableTossForm();
    });
  event.preventDefault();
  });
  $("#message_screen").click(function(){
    $("#message").addClass("hidden");
    $("#message_screen").addClass("hidden");
    reactivateSock();
  });
  $("#toss_box").focusin(function(){
    deactivateSock();
  });
  $("#toss_box").focusout(function(){
    reactivateSock();
  });
  reactivateSock();
});
