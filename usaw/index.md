---
layout: full-page
title: USAW Competition Results
tags: [usaw, competition, results, weightlifting, national]
modified: 07-26-2011
comments: true
image:
  feature: header.jpg
---

<html>
  <form name="searchField" onsubmit="return dbquery();">
	<input type="text" name="searchField" id="searchField" placeholder="Enter Athlete or Competition..." onKeyUp="dbquery();">
  </form>
  <br />
  <div id="status"></div>
  <br />
  <div id="tableHere"></div>
  <br />
</html>

<script>

var httpObject = null;
var getBaseUrl = 'http://callahan.nerdster.org:8080/usaw/';

function resetText(){
    document.getElementById('status').innerHTML = "";
    document.getElementById('tableHere').innerHTML =
        '<h3>What\'s this?</h3>' +
        '<p>Search above to look through a relatively complete database of US national events ' +
        'since the beginning of time (or at least since the modern weight classes were in effect) ' +
        'If you have a fix or addition to the results, <a href="mailto:steve.a.jarvis@gmail.com">email me</a> ' +
        'or file an issue on <a href="https://github.com/stevejarvis/usa-weightlifting-results">Github</a>.' +
        '<br><br>\'*\' denotes record attempt, \'x\' denotes missed attempt.' +
        '<br><br>Last updated <time datetime="{{ page.modified | date: "%Y-%m-%d" }}">{{ page.modified | date: "%B %d, %Y" }}</time>.' +
        '<br><br>Huge thanks to <a href="http://www.lifttilyadie.com/w8lift.htm">OWOW and Butch Curry</a> ' +
        'for organizing most of the results.</p>';
}

//Get the HTTP Object.
function getHTTPObject(){
	if (window.XMLHttpRequest){
		//Make sure the object is currently null.
	    return new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	else {
	    alert("Your browser does not support AJAX.");
	    return null;
	}
}

//Make the table in the table div.
function setTable(){
	if(httpObject.readyState == 4){
        document.getElementById('tableHere').innerHTML = httpObject.responseText +
            '<br>\'*\' denotes record attempt<br>\'x\' denotes missed attempt';
		httpObject = null;
    }
}

// Query based on the search box.
function dbquery(){
	// Clear the comps and table when they start typing. Say we're lookin..
    if( document.getElementById('searchField').value != "") {
	    document.getElementById('status').innerHTML = "Searching...";
	    httpObject = getHTTPObject();
        if (httpObject != null) {
    	    httpObject.open("GET",
                            getBaseUrl.concat("query.php/?key="+document.getElementById('searchField').value),
                            true);
		    httpObject.send(null);
            httpObject.onreadystatechange = setOptions;
        }
    }
    else {
        resetText();
    }

	return false;
}

// Show what the heck we're doing.'
function setOptions(){
	if(httpObject.readyState == 4){
        document.getElementById('status').innerHTML = httpObject.responseText;
    }
}

// Get the table from the search box
function getTableFromSearch(comp, year, div){
	document.getElementById('tableHere').innerHTML = "Loading Table...";
	httpObject = getHTTPObject();
	if (httpObject != null) {
	    httpObject.open("GET",
                        getBaseUrl.concat("maketable.php/?comp="+comp+"&year="+year),
                        true);
	    httpObject.send(null);
	    httpObject.onreadystatechange = setTable;
        document.getElementById('tableHere').scrollIntoView(true);
	}
}

// Start with set text
window.onload = function() {
    resetText();
};

</script>
