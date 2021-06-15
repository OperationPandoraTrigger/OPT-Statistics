var objects, objectcategories_SWORD, objectcategories_ARF, objectitems_SWORD, objectitems_ARF;
var SelectedMissionID = 0;
var MissionNames = [];
var scrollTop;

// ----- ObjectCategories -----

function show_ObjectCategories_SWORD() {
    objectcategories_SWORD = new Tabulator("#objectcategories_SWORD", {
        ajaxURL: "objectcategories.php?mission=" + SelectedMissionID + "&side=SWORD",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

function show_ObjectCategories_ARF() {
    objectcategories_ARF = new Tabulator("#objectcategories_ARF", {
        ajaxURL: "objectcategories.php?mission=" + SelectedMissionID + "&side=ARF",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

// ----- ObjectItems -----

function show_ObjectItems_SWORD() {
    objectitems_SWORD = new Tabulator("#objectitems_SWORD", {
        ajaxURL: "objectitems.php?mission=" + SelectedMissionID + "&side=SWORD",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Produkt", field: "Name", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 3, headerClick:function(){ScrollToObjectItems();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();} },
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

function show_ObjectItems_ARF() {
    objectitems_ARF = new Tabulator("#objectitems_ARF", {
        ajaxURL: "objectitems.php?mission=" + SelectedMissionID + "&side=ARF",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Produkt", field: "Name", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 3, headerClick:function(){ScrollToObjectItems();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();} },
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

// ----- Objects -----

function show_Objects() {
    objects = new Tabulator("#objects", {
        ajaxURL: "objects.php?mission=" + SelectedMissionID,
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Lifetime", dir: "asc" },
        ],
        selectable: false,
        columns: [
            { title: "Objekt", field: "Object", editor: "input", headerSortStartingDir: "asc", widthGrow: 5, headerClick:function(){ScrollToObjects();} },
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 3, headerClick:function(){ScrollToObjects();} },
            { title: "Käufer", field: "Buyer", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 5, headerClick:function(){ScrollToObjects();}, formatter:function(cell, formatterParams)
                {
                    var value = cell.getValue();
                    var PlayerSide = cell._cell.row.data.Side;
                    if(PlayerSide == "NATO") cell.getElement().style.color = 'rgb(180, 180, 255, 1)';
                    if(PlayerSide == "CSAT") cell.getElement().style.color = 'rgb(251, 202, 202, 1)';
                    if(PlayerSide == "AAF") cell.getElement().style.color = 'rgb(187, 234, 187, 1)';
                    return value;
                }
            },
            { title: "Kosten", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 5, headerClick:function(){ScrollToObjects();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
            {
                title: "Lebenszeit [s]", field: "Lifetime", hozAlign: "left", editor: true, headerSortStartingDir: "asc", widthGrow: 5, headerClick:function(){ScrollToObjects();}, formatter: "progress", formatterParams: {
                    min: 0,
                    max: 3000,
                    color: ["red", "orange", "green"],
                    legend: true,
                    legendColor: "#000000",
                    legendAlign: "center",
                }
            },
        ],
    });
}

function StringToCurrency(str)
{
    return parseInt(str, 10).toLocaleString('de',
    { 
        style           : 'currency',
        currency        : 'EUR',
        currencyDisplay : 'symbol',
        maximumFractionDigits    : 0,
        useGrouping     : true
    });
}

function fillList(resp) {
    var MissionPreselector;
    var PreselectorMissionID;

    var select = document.getElementById("MissionSelector");
    resp.MissionData.forEach(Mission => {
        select.options[select.options.length] = new Option(Mission.Start.toString().split(' ')[0] + " // " + Mission.CampaignName.toString() + " // " + Mission.MissionName.toString(), Mission.ID);
        MissionNames.push(Mission.MissionName.toString());

        if (SelectedMissionID == Mission.ID)
        {
            MissionPreselector = select.options.length - 1;
            PreselectorMissionID = Mission.ID;
        }
        if (!SelectedMissionID)
        {
            MissionPreselector = select.options.length - 1;
            PreselectorMissionID = Mission.ID;
        }
    });
    select.selectedIndex = MissionPreselector;  // Mission vorauswählen
    SelectedMissionID = PreselectorMissionID;
    document.getElementsByClassName('CampaignPoints')[0].innerHTML = "Aktuelle Kampagne &#187; SWORD " + resp.CampaignPoints[0].PointsSWORD + " : " + resp.CampaignPoints[0].PointsARF + " ARF";
    document.getElementsByClassName('Schlachtlink')[0].innerHTML = "<a href=index.html?mission=" + SelectedMissionID + ">Schlacht</a>";
}

function MissionSelectorAction(MissionID)
{
    SelectedMissionID = MissionID;
    $.ajax(
    {
        url: "getdata.php?mission=" + MissionID,
        type: "GET",
        dataType: "json",
        success: function (resp)
        {
            objectcategories_SWORD.clearData();
            objectcategories_SWORD.setData("objectcategories.php?mission=" + MissionID + "&side=SWORD");
            objectcategories_ARF.clearData();
            objectcategories_ARF.setData("objectcategories.php?mission=" + MissionID + "&side=ARF");
            objectitems_SWORD.clearData();
            objectitems_SWORD.setData("objectitems.php?mission=" + MissionID + "&side=SWORD");
            objectitems_ARF.clearData();
            objectitems_ARF.setData("objectitems.php?mission=" + MissionID + "&side=ARF");
            objects.clearData();
            objects.setData("objects.php?mission=" + MissionID);
        }
    });
    // Update URL
    history.pushState({}, null, "objects.html?mission=" + SelectedMissionID);
    document.getElementsByClassName('Schlachtlink')[0].innerHTML = "<a href=index.html?mission=" + MissionID + ">Schlacht</a>";
}

window.addEventListener('resize', function ()
{
    objectcategories_SWORD.redraw();
    objectcategories_ARF.redraw();
    objectitems_SWORD.redraw();
    objectitems_ARF.redraw();
    objects.redraw();
});


function GetURLParameter(parameter)
{
    if(parameter=(new RegExp('[?&]'+encodeURIComponent(parameter)+'=([^&]*)')).exec(location.search)) return decodeURIComponent(parameter[1]);
}

$(document).ready(function () {
    SelectedMissionID = GetURLParameter("mission");

    if (typeof SelectedMissionID !== 'undefined') var getdataURL = "getdata.php?mission=" + SelectedMissionID;
    else var getdataURL = "getdata.php";

    $.ajax(
    {
        url: getdataURL,
        type: "GET",
        dataType: "json",
        success: function (resp)
        {
            fillList(resp);
            show_ObjectCategories_SWORD();
            show_ObjectCategories_ARF();
            show_ObjectItems_SWORD();
            show_ObjectItems_ARF();
            show_Objects();
        }
    });

    // Add smooth scrolling to all links
    $("a").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 36
            }, 300, function () {});
        }
    });

    
});


function ScrollToObjectCategories() {
    $('html, body').animate({
        scrollTop: $(".objectcategorycontainer").offset().top - 36
    }, 300, function () {});
}

function ScrollToObjectItems() {
    $('html, body').animate({
        scrollTop: $(".objectitemscontainer").offset().top - 36
    }, 300, function () {});
}

function ScrollToObjects() {
    $('html, body').animate({
        scrollTop: $(".objectscontainer").offset().top - 36
    }, 300, function () {});
}



/*
jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}
*/

window.onload=function()
{
    document.getElementsByClassName("objectcategories_SWORD_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("objectcategories_SWORD_CSV")[0].addEventListener("click", function() { objectcategories_SWORD.download("csv", MissionNames[SelectedMissionID - 1] + " - Objekt Kategorien SWORD.csv"); });

    document.getElementsByClassName("objectcategories_ARF_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("objectcategories_ARF_CSV")[0].addEventListener("click", function() { objectcategories_ARF.download("csv", MissionNames[SelectedMissionID - 1] + " - Objekt Kategorien ARF.csv"); });
    document.getElementsByClassName("objectitems_SWORD_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("objectitems_SWORD_CSV")[0].addEventListener("click", function() { objectitems_SWORD.download("csv", MissionNames[SelectedMissionID - 1] + " - Objekt Typen SWORD.csv"); });

    document.getElementsByClassName("objectitems_ARF_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("objectitems_ARF_CSV")[0].addEventListener("click", function() { objectitems_ARF.download("csv", MissionNames[SelectedMissionID - 1] + " - Objekt Typen ARF.csv"); });

    document.getElementsByClassName("objects_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("objects_CSV")[0].addEventListener("click", function() { objects.download("csv", MissionNames[SelectedMissionID - 1] + " - Objekte Einzeln.csv"); });
}
