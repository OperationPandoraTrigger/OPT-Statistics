var stats;
var SelectedCampaignID = 0;
var scrollDisabled = false
var scrollTop;
var Kampagnenname = [];

// ----- Stats ------

function show_Stats() {
    stats = new Tabulator("#stats", {
        ajaxURL: "mercurat.php",
        layout: "fitColumns",
        virtualDom: false,
        initialSort: [
            { column: "Schlacht", dir: "asc" },
        ],
        columnHeaderVertAlign: "middle",
        rowClick: function (e, row) {
            window.location="index.html?mission=" + row._row.data.ID;
        },
        columns: [
            { title: "ID", field: "ID", visible: false },
            { title: "Schlacht", field: "Schlacht", editor: "input", headerSortStartingDir: "asc", widthGrow: 2, headerClick:function(){ScrollToStats();} },
            { title: "Spieler", field: "NumPlayers", editor: "input", headerSortStartingDir: "asc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
            { title: "Wochentag", field: "Weekday", editor: "input", headerSortStartingDir: "asc", widthGrow: 2, hozAlign:"center", headerClick:function(){ScrollToStats();} },
            {
                title: "Endpunktestand",
                columns: [
                    { title: "SWORD", titleDownload: "PointsSWORD", field: "PointsSWORD", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                    { title: "ARF", titleDownload: "PointsARF", field: "PointsARF", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "Kills",
                columns: [
                    { title: "SWORD", titleDownload: "KillsSWORD", field: "KillsSWORD", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                    { title: "ARF", titleDownload: "KillsARF", field: "KillsARF", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "Absch&uuml;sse",
                columns: [
                    { title: "SWORD", titleDownload: "DeathsSWORD", field: "DeathsSWORD", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                    { title: "ARF", titleDownload: "DeathsARF", field: "DeathsARF", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "Budget",
                columns: [
                    { title: "SWORD", titleDownload: "BudgetSWORD", field: "BudgetSWORD", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                    { title: "ARF", titleDownload: "BudgetARF", field: "BudgetARF", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "K&auml;ufe",
                columns: [
                    {
                        title: "Ausr&uuml;stung",
                        columns: [
                            { title: "SWORD", titleDownload: "AusruestungSWORD", field: "SWORD_Ausruestung", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                            { title: "ARF", titleDownload:" AusruestungARF", field: "ARF_Ausruestung", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                        ],
                    },
                    {
                        title: "Boote",
                        columns: [
                            { title: "SWORD", titleDownload: "BootSWORD", field: "SWORD_Boot", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                            { title: "ARF", titleDownload: "BootARF", field: "ARF_Boot", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                        ],
                    },
                    {
                        title: "Flugger&auml;te",
                        columns: [
                            { title: "SWORD", titleDownload: "FlugSWORD", field: "SWORD_Flug", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                            { title: "ARF", titleDownload: "FlugARF", field: "ARF_Flug", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                        ],
                    },
                    {
                        title: "Leichtes",
                        columns: [
                            { title: "SWORD", titleDownload: "LeichtSWORD", field: "SWORD_Leicht", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                            { title: "ARF", titleDownload: "LeichtARF", field: "ARF_Leicht", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                        ],
                    },
                    {
                        title: "Schweres",
                        columns: [
                            { title: "SWORD", titleDownload: "SchwerSWORD", field: "SWORD_Schwer", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                            { title: "ARF", titleDownload: "SchwerARF", field: "ARF_Schwer", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                        ],
                    },
                    {
                        title: "Station&auml;r",
                        columns: [
                            { title: "SWORD", titleDownload: "StationaerSWORD", field: "SWORD_Stationaer", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                            { title: "ARF", titleDownload: "StationaerARF", field: "ARF_Stationaer", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                        ],
                    },
                ],
            },
        ]
    });
}


function StringToCurrency(str)
{
    return parseInt(str, 10).toLocaleString( 'de',
    { 
        style           : 'currency',
        currency        : 'EUR',
        currencyDisplay : 'symbol',
        maximumFractionDigits    : 0,
        useGrouping     : true
    });
}

function fillList(CampaignData, CampaignPoints) {
    var select = document.getElementById("CampaignSelector");
    CampaignData.forEach(Campaign => {
        select.options[select.options.length] = new Option(Campaign.CampaignName.toString(), Campaign.ID);
        SelectedCampaignID = Campaign.ID;
        Kampagnenname.push(Campaign.CampaignName.toString());
    });
    select.selectedIndex = CampaignData.length - 1;  // letzte Mission vorauswählen
    document.getElementsByClassName('CampaignPoints')[0].innerHTML = "Aktuelle Kampagne &#187; SWORD " + CampaignPoints[0].PointsSWORD + " : " + CampaignPoints[0].PointsARF + " ARF";
}

function CampaignSelectorAction(CampaignID) {
    SelectedCampaignID = CampaignID;
    $.ajax(
        {
            url: "campaigns.php?campaign=" + CampaignID,
            type: "GET",
            dataType: "json",
            success: function (resp) {
                $("#points").unbind("plothover");
                stats.clearData();
                stats.setData("mercurat.php?campaign=" + CampaignID);
            }
        });
}

window.addEventListener('resize', function () {
    stats.redraw();
});

$(document).ready(function () {
    $.ajax(
        {
            url: "campaigns.php",
            type: "GET",
            dataType: "json",
            success: function (resp) {
                // CampaignData, CampaignPoints, MissionData, Points_SWORD, Points_ARF
                fillList(resp.CampaignData, resp.CampaignPoints);
                show_Stats();
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


function ScrollToStats() {
    $('html, body').animate({
        scrollTop: $(".statscontainer").offset().top - 36
    }, 300, function () {});
}

window.onload=function()
{
    document.getElementsByClassName("campaigns_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaigns_CSV")[0].addEventListener("click", function() { stats.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Gespielte Schlachtdetails.csv"); });
}
