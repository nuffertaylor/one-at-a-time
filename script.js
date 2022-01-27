var inUse; //bool
var curUser; //str
var matchingCookie; //bool
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
  let curCookie = "";
  if(document.cookie)
    curCookie = parseCookie(document.cookie)["cookie"];
  var res = JSON.parse(httpGet("/inUse"));
  if(Object.keys(res).length === 0)
  {
    inUse = false;
    curUser = "";
    matchingCookie = false;
  }
  else
  {
    inUse = true;
    curUser = res.name;
    matchingCookie = (curCookie == res.cookie) ? true : false;
  }
  inUseElement = document.getElementById("inUse");
  curUserElement = document.getElementById("curUser");
  startUsingButton = document.getElementById("startUsing");
  stopUsingButton = document.getElementById("stopUsing");
  body = document.getElementById("body");
}

function genCookieStr(length)
{
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) 
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
}
function writeTomorrowCookie(cookieStr)
{
  var now = new Date();
  var time = now.getTime();
  var expireTime = time + 1000*60*60*24;
  now.setTime(expireTime);
  document.cookie = "cookie=" + cookieStr + ";expires="+now.toUTCString() + ";path=/;";
}
const parseCookie = str => str.split(';').map(v => v.split('=')).reduce((acc, v) => {acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim()); return acc;}, {});
function deleteCookie(){document.cookie = "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";}

function startUsing()
{
  curUser = prompt("Please enter your name", "Harry Potter");
  if(curUser)
  {
    let c = genCookieStr(9);
    writeTomorrowCookie(c)
    let registerUrl = "/startUsing?name=" + curUser + "&cookie=" + c;
    httpGet(registerUrl);
    inUse = true;
    matchingCookie = true;
    populatePage();
  }
}

function stopUsing()
{
  httpGet("/stopUsing");
  deleteCookie();
  inUse = false;
  curUser = "";
  matchingCookie = false;
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
    if(matchingCookie)
      stopUsingButton.classList.remove("hide");
    else
      stopUsingButton.classList.add("hide");
    body.classList.remove("availableColor");
    body.classList.add("inUseColor");
  }
}

