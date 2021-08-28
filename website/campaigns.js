var points, budget, stats, playerstats;
var SelectedCampaignID = 0;
var scrollDisabled = false
var scrollTop;
var Kampagnenname = [];

function show_chartPoints(SWORD, SumSWORD, ARF, SumARF, Mission)
{
    // Autoscaling für beide y-Achsen
    var MaxScale = -1000000000;
    if (SumSWORD != null) SumSWORD.forEach(element => {
        MaxScale = Math.max(MaxScale, element[1]);
    });
    if (SumARF != null) SumARF.forEach(element => {
        MaxScale = Math.max(MaxScale, element[1]);
    });

    var Diff = Math.abs(MaxScale - MinScale);

    var MinScale = 0;
    MaxScale *= 1.05;   // 5% mehr anzeigen

    // Missiondates for x-axis ticks
    var MissionDates = [];
    Mission.forEach(element => {
        MissionDates.push(element[0]);
    });

    var ColorSWORD = "magenta";
    var ColorARF = "cyan";
    var ColorDots = "blue";

    points = $.plot($("#points"),
    [
        { data: SWORD, label: "sword", hoverable: false, points: { show: false }, color: ColorSWORD, lines: { show: false, fill: false }, bars: { show: true, fill: true, align: "right" } },
        { data: SumSWORD, label: "sumsword", hoverable: false, points: { show: false }, color: ColorSWORD, lines: { show: true, fill: false } },
        { data: ARF, label: "arf", yaxis: 2, hoverable: false, points: { show: false }, color: ColorARF, lines: { show: false, fill: false }, bars: { show: true, fill: true, align: "left" } },
        { data: SumARF, label: "sumarf", yaxis: 2, hoverable: false, points: { show: false }, color: ColorARF, lines: { show: true, fill: false } },
        { data: Mission, label: "mission", yaxis: 3, bars: { show: false }, color: ColorDots, lines: { show: false } }
    ],
    {
        series:
        {
            lines:
            {
                show: true,
                fill: true,
                lineWidth: 2
            },
            bars:
            {
                barWidth: 0.05,
             //   align: "center",
                horizontal: false
            },
            splines:
            {
                show: false,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points:
            {
                radius: 2,
                show: true
            },
            shadowSize: 2,
        },
        legend:
        {
            position: "sw"
        },

        grid:
        {
            verticalLines: true,
            hoverable: true,
            clickable: true,
            tickColor: 'rgb(80, 80, 80, 1)',
            borderWidth: 1,
            color: "black",
            mouseActiveRadius: 100
        },
        colors: ["rgba(138, 185, 154, 1)", "rgba(113, 88, 106, 1)"],

        xaxis:
        {
            mode: "time",
            timeBase: "milliseconds",
            timeformat: "%Y-%m-%d",
            tickLength: 10,
            color: "black",
            axisLabel: "Time",
            ticks: MissionDates
        },

        yaxes:
        [{
            autoScale: 'none',
            min: MinScale,
            max: MaxScale,
            position: "left",
            color: "black",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3
        },
        {
            autoScale: 'none',
            min: MinScale,
            max: MaxScale,
            position: "right",
            color: "black",
            axisLabel: "ARF",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            show: false
        },
        {
            position: "right",
            color: "black",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            show: false
        }],
        zoom:
        {
            interactive: true
        },

        pan:
        {
            interactive: true
        },

        tooltip: true
    });

    //Tooltips
    $("<div id='tooltip'></div>").css(
        {
            position: "absolute",
            display: "none",
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 1.00
        }).appendTo("body");

    $("#points").bind("plothover", function (event, pos, item)
    {
        if (item)
        {
            var txt = "<b><u>" + Mission[item.dataIndex][2] + "</u></b>" +
                "<br>SWORD +" + SWORD[item.dataIndex][1] + " (&rArr; " + SumSWORD[item.dataIndex][1] + ") Punkte" +
                "<br>ARF +" + ARF[item.dataIndex][1] + " (&rArr; " + SumARF[item.dataIndex][1] + ") Punkte" +
                "<br>Differenz: " + Math.abs(SWORD[item.dataIndex][1] - ARF[item.dataIndex][1]) + " (&rArr; " + Math.abs(SumSWORD[item.dataIndex][1] - SumARF[item.dataIndex][1]) + ") Punkte";
            var offsetX = 15;
            var EdgeDistance = $(window).width() - item.pageX;
            if (EdgeDistance < 250) offsetX = -240;
            $("#tooltip").html(txt).css({ top: item.pageY + 15, left: item.pageX + offsetX }).fadeIn(0);
        }
        else
        {
            $("#tooltip").hide();
        }
    });
} //show_chartPoints

// ----- Stats ------

function show_Stats() {
    stats = new Tabulator("#stats", {
        ajaxURL: "campaignmissions.php",
        layout: "fitColumns",
        virtualDom: false,
        initialSort: [
            { column: "Start", dir: "asc" },
        ],
        columnHeaderVertAlign: "middle",
        rowClick: function (e, row) {
            window.location="index.html?mission=" + row._row.data.ID;
        },
        columns: [
            { title: "ID", field: "ID", visible: false },
            { title: "Schlacht", field: "MissionName", editor: "input", headerSortStartingDir: "asc", widthGrow: 2, headerClick:function(){ScrollToStats();} },
            { title: "Beginn", field: "Start", editor: "input", headerSortStartingDir: "asc", widthGrow: 2, hozAlign:"center", headerClick:function(){ScrollToStats();} },
            { title: "Ende", field: "End", editor: "input", headerSortStartingDir: "asc", widthGrow: 2, hozAlign:"center", headerClick:function(){ScrollToStats();} },
            { title: "Dateiname", field: "MissionFileName", editor: "input", headerSortStartingDir: "asc", widthGrow: 2, headerClick:function(){ScrollToStats();} },
            {
                title: "Gespielte Fraktion",
                columns: [
                    { title: "SWORD", field: "SideSWORD", editor: "input", headerSortStartingDir: "asc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                    { title: "ARF", field: "SideARF", editor: "input", headerSortStartingDir: "asc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "Endpunktestand",
                columns: [
                    { title: "SWORD", field: "PointsSWORD", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                    { title: "ARF", field: "PointsARF", editor: "input", headerSortStartingDir: "desc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} },
                ],
            },
            { title: "Gewertet", field: "Rated", editor: "input", headerSortStartingDir: "asc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();}, formatter:"tickCross" },
        ]
    });
}


function show_PlayerStats()
{
    playerstats = new Tabulator("#playerstats", {
        ajaxURL: "playerstats.php?campaign=" + SelectedCampaignID,
        layout: "fitColumns",
        virtualDom: false,
        initialSort: [
            { column: "Kills", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "PlayerUID", field: "PlayerUID", visible: false },
            { title: "Name", field: "Name", editor: "input", headerSortStartingDir: "asc", widthGrow: 1.5, headerClick:function(){ScrollToPlayerStats();} },
            {
                title: "Absch&uuml;sse",
                columns: [
                    { title: "Feinde", titleDownload: "KillFeinde", field: "Kills", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToPlayerStats();} },
                    { title: "Freunde", titleDownload: "KillFreunde", field: "Teamkills", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();} },
                    { title: "Fahrzeuge", titleDownload: "KillKFZ", field: "Vehiclekills", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();} },
                ],
            },
            { title: "K/D", field: "KD", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.6, headerClick:function(){ScrollToPlayerStats();}, formatter:function(cell, formatterParams)
                {
                    var value = cell.getValue();
                    if (value == "999999") value = "&#x221e;";
                    return value;
                }
            },
            {
                title: "Gestorben durch",
                columns: [
                    { title: "Feind", titleDownload: "KilledByFeind", field: "DeathsByEnemy", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8,  headerClick:function(){ScrollToPlayerStats();} },
                    { title: "Freund", titleDownload: "KilledByFreund", field: "DeathsByTeammate", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToPlayerStats();} },
                ],
            },
            { title: "Flaggen", field: "FlagConquers", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToPlayerStats();} },
            { title: "Revives", field: "Revives", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToPlayerStats();} },
            { title: "Respawns", field: "Respawns", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();} },
            {
                title: "Reisedistanz [km] als",
                columns: [
                    { title: "Pilot", titleDownload: "DistanzPilot", field: "PilotDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToPlayerStats();} },
                    { title: "Passagier", titleDownload: "DistanzPassagier", field: "AirPassengerDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();} },
                    { title: "Fahrer", titleDownload: "DistanzFahrer", field: "DriverDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();} },
                    { title: "Mitfahrer", titleDownload: "DistanzMitfahrer", field: "DrivePassengerDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();} },
                ],
            },
            { title: "Kosten", field: "Cost", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
            { title: "Teilnahmen", field: "Participations", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();} },
            {
                title: "L&auml;ngster<br>Schuss [m]", titleDownload: "MaxKillDistance", field: "MaxKillDistance", hozAlign: "left", editor: true, headerSortStartingDir: "desc", headerClick:function(){ScrollToPlayerStats();}, formatter: "progress", formatterParams: {
                    min: 0,
                    max: 500,
                    color: ["red", "orange", "green"],
                    legend: true,
                    legendColor: "#000000",
                    legendAlign: "center",
                }
            },
            {
                title: "FPS", field: "FPS", hozAlign: "left", editor: true, headerSortStartingDir: "desc", widthGrow: 0.7, headerClick:function(){ScrollToPlayerStats();}, formatter: "progress", formatterParams: {
                    min: 0,
                    max: 60,
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
    closePopup();
    SelectedCampaignID = CampaignID;
    $.ajax(
        {
            url: "campaigns.php?campaign=" + CampaignID,
            type: "GET",
            dataType: "json",
            success: function (resp) {
                $("#points").unbind("plothover");
                show_chartPoints(resp.Points_SWORD, resp.Points_SumSWORD, resp.Points_ARF, resp.Points_SumARF, resp.Points_MissionName);
                stats.clearData();
                stats.setData("campaignmissions.php?campaign=" + CampaignID);
                playerstats.clearData();
                playerstats.setData("playerstats.php?campaign=" + CampaignID);
            }
        });
}

window.addEventListener('resize', function () {
    stats.redraw();
    playerstats.redraw();
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
                show_chartPoints(resp.Points_SWORD, resp.Points_SumSWORD, resp.Points_ARF, resp.Points_SumARF, resp.Points_MissionName);
                show_Stats();
                show_PlayerStats();
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

function ScrollToPlayerStats() {
    $('html, body').animate({
        scrollTop: $(".playerstatscontainer").offset().top - 36
    }, 300, function () {});
}

window.onload=function()
{
    document.getElementsByClassName("campaigns_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaigns_CSV")[0].addEventListener("click", function() { stats.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Gespielte Schlachten.csv"); });
    document.getElementsByClassName("campaignplayers_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignplayers_CSV")[0].addEventListener("click", function() { playerstats.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Spielerpunkte.csv"); });
}
