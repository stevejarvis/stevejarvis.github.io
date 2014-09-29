---
layout: page
title: USAW Competition Results
tags: [usaw, competition, results, weightlifting]
modified: 09-26-2014
comments: false
image:
  feature: header.jpg
---

<html>
  <table>
	<tr>
	  <td>
		<form name="formOptions" onsubmit="return getComps();">
		  <select onChange="getYears()" name="comp" id="comp"/>
		  <option value="null">Select Competition...</option>
		  <option value="AmericanOpen">American Open</option>
		  <option value="CollegiateNationals">Collegiate Nationals</option>
		  <option value="JuniorNationals">Junior Nationals</option>
		  <option value="NationalChampionship">National Championship</option>
		  <option value="OlympicTrials">Olympic Trials</option>
		</form>
	  </td>
	  <td>
		<div id="resultsPadding"><b>OR</b></div>
	  </td>
	  <td>
		<form name="athleteSearch" onsubmit="return getComps();" style="display:inline;">
		  <input type="text" name="name" id="name" placeholder="Enter Name..." onKeyUp="getComps();">
		  <input type="submit" value="Search"/>
		</form>
	  </td>
	</tr>
  </table>
  <br />
  <div id="years"></div>
  <div id="topOTable"> &nbsp; </div>
  <br />
  <div id="tableHere"></div>
  <br />
</html>

<script>

var httpObject = null;
var getBaseUrl = 'http://callahan.nerdster.org:8080/usaw/'

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

//Change the value of the div to the year dropdown after comp is selected.
function setYearDropdown(){
	if(httpObject.readyState == 4){
        document.getElementById('years').innerHTML = httpObject.responseText;
		httpObject = null;
    }
}

//Make the table in the table div.
function setTable(){
	if(httpObject.readyState == 4){
        document.getElementById('tableHere').innerHTML = httpObject.responseText;
		httpObject = null;
    }
}

//AJAX call to get the years. Call the function to chage the page.
function getYears(){
	//Clear the table
	document.getElementById('tableHere').innerHTML = "";
    document.getElementById('years').innerHTML = "Loading Years...";
	httpObject = getHTTPObject();
	if (httpObject != null) {
	    httpObject.open(
            "GET",
            getBaseUrl.concat("getYears.php/?target="+document.getElementById('comp').value),
            true);
	    httpObject.send(null);
	    httpObject.onreadystatechange = setYearDropdown;
	}
}

//Called from year dropdown. Call the function to add the table to the page.
function getTable(){
       document.getElementById('tableHere').innerHTML = "Loading Table...";
	httpObject = getHTTPObject();
	if (httpObject != null) {
	    httpObject.open("GET",
                        getBaseUrl.concat("makeTable.php/?comp="+document.getElementById('comp').value+"&year="+document.getElementById('year').value),
                        true);
	    httpObject.send(null);
	    httpObject.onreadystatechange = setTable;
	}
}

/*
 * Now these functions are if they searched for name.
 */
//Calls to get all the results for the named athlete.
function getComps(){
	//Clear the comps and table when they start typing. Say we're lookin..
	document.getElementById('tableHere').innerHTML = "";
	document.getElementById('years').innerHTML = "Searching...";
	httpObject = getHTTPObject();
    if (httpObject != null) {
		// Get comps
    	httpObject.open("GET",
                        getBaseUrl.concat("findAthlete.php/?name="+document.getElementById('name').value),
                        true);
		httpObject.send(null);
        httpObject.onreadystatechange = setComps;
     }

	return false;
}

//Set the options
function setComps(){
	if(httpObject.readyState == 4){
        document.getElementById('years').innerHTML = httpObject.responseText;
    }
}

//Get the table from the search box
function getTableFromSearch(comp, year, div){
	document.getElementById('tableHere').innerHTML = "Loading Table...";
	httpObject = getHTTPObject();
	if (httpObject != null) {
	    httpObject.open("GET",
                        getBaseUrl.concat("makeTable.php/?comp="+comp+"&year="+year),
                        true);
	    httpObject.send(null);
	    httpObject.onreadystatechange = setTable;
	}
}

</script>
