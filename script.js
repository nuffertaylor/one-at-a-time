var inUse;
var curUser;
var inUseElement;
var curUserElement;
var startUsingButton;
var stopUsingButton;
var body;

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function initializeVars()
{
  console.log(httpGet("/inUse"));
  inUse = false;
  curUser = "";
  inUseElement = document.getElementById("inUse");
  curUserElement = document.getElementById("curUser");
  startUsingButton = document.getElementById("startUsing");
  stopUsingButton = document.getElementById("stopUsing");
  body = document.getElementById("body");
}

function startUsing()
{
  curUser = prompt("Please enter your name", "Harry Potter");
  if(curUser)
  {
    inUse = true;
    populatePage();
  }
}
function stopUsing()
{
  inUse = false;
  curUser = "";
  populatePage();
}

function firstLoad() {initializeVars(); populatePage();}

function populatePage()
{
  if(!inUse) 
  {
    inUseElement.innerHTML = "Available";
    curUserElement.innerHTML = "";
    startUsingButton.classList.remove("hide");
    stopUsingButton.classList.add("hide");
    body.classList.remove("inUseColor");
    body.classList.add("availableColor");
  }
  else
  {
    inUseElement.innerHTML = "In Use";
    curUserElement.innerHTML = curUser + " is using it";
    startUsingButton.classList.add("hide");
    stopUsingButton.classList.remove("hide");
    body.classList.remove("availableColor");
    body.classList.add("inUseColor");
  }
}

