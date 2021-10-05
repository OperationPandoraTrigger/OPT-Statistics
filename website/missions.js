var points, budget, stats;
var SelectedMissionID = 0;
var scrollDisabled = false
var MissionNames = [];
var scrollTop;

function show_chartPoints(SWORD, ARF, Conquer, SideSWORD, SideARF)
{
    switch (SideSWORD)
    {
        case "NATO":
            ColorSWORD = "blue";
            break;

        case "CSAT":
            ColorSWORD = "red";
            break;

        case "AAF":
            ColorSWORD = "lightgreen";
            break;
    
        default:
            ColorSWORD = "";
    }

    switch (SideARF)
    {
        case "NATO":
            ColorARF = "blue";
            break;

        case "CSAT":
            ColorARF = "red";
            break;

        case "AAF":
            ColorARF = "lightgreen";
            break;
    
        default:
            ColorARF = "";
    }

    // Übrig gebliebene Farbe für die Infopunkte
    if (ColorSWORD != "blue" && ColorARF != "blue") ColorDots = "blue";
    else if (ColorSWORD != "red" && ColorARF != "red") ColorDots = "red";
    else if (ColorSWORD != "green" && ColorARF != "green") ColorDots = "green";

    // Autoscaling für beide y-Achsen
    var MaxScale = -1000000000;
    if (SWORD != null) SWORD.forEach(element =>{
        var number = parseFloat(element[1]);
        MaxScale = Math.max(MaxScale, number);
    });
    if (ARF != null) ARF.forEach(element => {
        var number = parseFloat(element[1]);
        MaxScale = Math.max(MaxScale, number);
    });

    var MinScale = 0;
    MaxScale *= 1.05;   // 5% mehr anzeigen

    points = $.plot($("#points"), [
        { data: SWORD, label: "sword", hoverable: false, points: { show: false }, color: ColorSWORD, lines: { show: true, fill: false } },
        { data: ARF, label: "arf", yaxis: 2, hoverable: false, points: { show: false }, color: ColorARF, lines: { show: true, fill: false } },
        { data: Conquer, label: "conq", yaxis: 3, bars: { show: false }, color: ColorDots, lines: { show: false } }
    ],
    {
        series:
        {
            lines:
            {
                show: true,
                fill: true
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
            timeformat: "%H:%M",
            tickLength: 10,
            color: "black",
            axisLabel: "Time",
        },

        yaxes: [
        {
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

        pan: {
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
            var txt = Conquer[item.dataIndex][2];
            var offsetX = 15;
            var EdgeDistance = $(window).width() - item.pageX;
            if (EdgeDistance < 400) offsetX = -350;
            $("#tooltip").html(txt).css({ top: item.pageY + 15, left: item.pageX + offsetX }).fadeIn(0);
        }
        else
        {
            $("#tooltip").hide();
        }
    });
} //show_chartPoints

// -----

function show_chartBudget(SWORD, ARF, SideSWORD, SideARF)
{
    switch (SideSWORD)
    {
        case "NATO":
            ColorSWORD = "blue";
            break;

        case "CSAT":
            ColorSWORD = "red";
            break;

        case "AAF":
            ColorSWORD = "lightgreen";
            break;
    
        default:
            ColorSWORD = "";
    }

    switch (SideARF)
    {
        case "NATO":
            ColorARF = "blue";
            break;

        case "CSAT":
            ColorARF = "red";
            break;

        case "AAF":
            ColorARF = "lightgreen";
            break;
    
        default:
            ColorARF = "";
    }

    // Autoscaling für beide y-Achsen
    var MinScale = 1000000000;
    var MaxScale = -1000000000;
    if (SWORD.length > 0) SWORD.forEach(element => {
        var number = parseFloat(element[1]);
        if (!isNaN(element[1])) MinScale = Math.min(MinScale, number);
        if (!isNaN(element[1])) MaxScale = Math.max(MaxScale, number);
    });
    if (ARF.length > 0) ARF.forEach(element => {
        var number = parseFloat(element[1]);
        if (!isNaN(element[1])) MinScale = Math.min(MinScale, number);
        if (!isNaN(element[1])) MaxScale = Math.max(MaxScale, number);
    });

    var Diff = Math.abs(MaxScale - MinScale);

    MinScale -= Diff * 0.05;   // 5% weniger anzeigen
    MaxScale += Diff * 0.05;   // 5% mehr anzeigen

    budget = $.plot($("#budget"), [
        { data: SWORD, label: "sword", hoverable: true, points: { show: true }, color: ColorSWORD, lines: { show: true, fill: false } },
        { data: ARF, label: "arf", yaxis: 2, hoverable: true, points: { show: true }, color: ColorARF, lines: { show: true, fill: false } }
    ],
    {
        series:
        {
            lines:
            {
                show: true,
                fill: true
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
            timeformat: "%H:%M",
            tickLength: 10,
            color: "black",
            axisLabel: "Time",
        },

        yaxes: [
        {
            autoScale: 'none',
            min: MinScale,
            max: MaxScale,
            position: "left",
            color: "black",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,

            tickFormatter: function suffixFormatter(val, axis) {
                if (val >= 1000000) return (val / 1000000).toFixed(1) + " M€";
                else if (val >= 1000) return (val / 1000).toFixed(0) + " k€";
                else if (val < 1000 && val > -1000) return (val).toFixed(0) + " €";
                else if (val <= -1000 && val > -1000000) return (val / 1000).toFixed(0) + " k€";
                else if (val <= -1000000) return (val / 1000000).toFixed(1) + " M€";
            }

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

    $("#budget").bind("plothover", function (event, pos, item)
    {
        if (item)
        {
            var txt = "";
            if (item.series.label == "sword") txt = SWORD[item.dataIndex][2];
            else if (item.series.label == "arf") txt = ARF[item.dataIndex][2];

            var offsetX = 15;
            var EdgeDistance = $(window).width() - item.pageX;
            if (EdgeDistance < 400) offsetX = -350;
            $("#tooltip").html(txt).css({ top: item.pageY + 15, left: item.pageX + offsetX }).fadeIn(0);
        }
        else
        {
            $("#tooltip").hide();
        }
    });

} //show_chartBudget

function show_chartFPS(playerdata)
{
    // Autoscaling für beide y-Achsen
    var MinFPS = 1000000000;
    var MaxFPS = -1000000000;
    var AvgFPS = 0;
    var AvgFPSNum = 0;

    if (playerdata.FPS != null) playerdata.FPS.forEach(element => {
        var FPS = parseFloat(element[1]);
        MinFPS = Math.min(MinFPS, FPS);
        MaxFPS = Math.max(MaxFPS, FPS);
        AvgFPS += FPS;
        AvgFPSNum++;
    });
    AvgFPS /= AvgFPSNum;

    // Graph Überschrift
    document.getElementsByClassName('FPSText')[0].innerHTML = playerdata.Info.Nickname + "s FPS w&auml;hrend der Schlacht (Min: " + MinFPS.toFixed(1) + " / Max: " + MaxFPS.toFixed(1) + " / &#8960;: " + AvgFPS.toFixed(1) + ")";

    var Diff = Math.abs(MaxFPS - MinFPS);
    
    var MinScale = MinFPS - Diff * 0.05;   // 5% weniger anzeigen
    var MaxScale = MaxFPS + Diff * 0.05;   // 5% mehr anzeigen

    fps = $.plot($("#fps"), [
        { data: playerdata.FPS, label: "fps", hoverable: false, points: { show: false }, color: "red", lines: { show: true, fill: false } }
    ],
    {
        series:
        {
            lines:
            {
                show: true,
                fill: true
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
            timeformat: "%H:%M",
            tickLength: 10,
            color: "black",
            axisLabel: "Time",
        },

        yaxes: [{
            autoScale: 'none',
            min: MinScale,
            max: MaxScale,
            position: "left",
            color: "black",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3
        }],
        zoom:
        {
            interactive: true
        },

        pan:
        {
            interactive: true
        },

        tooltip: false
    });
} //show_chartFPS

// -----

// ----- Stats ------
function show_Stats()
{
    stats = new Tabulator("#stats", {
        ajaxURL: "stats.php?mission=" + SelectedMissionID,
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Kills", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        rowClick: function (e, row)
        {
            show_Popup(row._row.data.PlayerUID);
        },
        columns: [
            { title: "PlayerUID", field: "PlayerUID", visible: false, download: true },
            { title: "Name", field: "Name", editor: "input", headerSortStartingDir: "asc", widthGrow: 1.5, headerClick:function(){ScrollToStats();}, formatter:function(cell, formatterParams)
                {
                    var value = cell.getValue();
                    var PlayerSide = cell._cell.row.data.PlayerSide;
                    if(PlayerSide == "NATO") cell.getElement().style.color = 'rgb(180, 180, 255, 1)';
                    if(PlayerSide == "CSAT") cell.getElement().style.color = 'rgb(251, 202, 202, 1)';
                    if(PlayerSide == "AAF") cell.getElement().style.color = 'rgb(187, 234, 187, 1)';
                    return value;
                }
            },
            { title: "PlayerSide", field: "PlayerSide", visible: false, download: true },
            {
                title: "Absch&uuml;sse",
                columns: [
                    { title: "Feind", titleDownload: "KillFeinde", field: "Kills", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToStats();} },
                    { title: "Freund", titleDownload: "KillFreunde", field: "Teamkills", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.9, headerClick:function(){ScrollToStats();} },
                    { title: "KFZ", titleDownload: "KillKFZ", field: "Vehiclekills", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.7, headerClick:function(){ScrollToStats();} },
                ],
            },
            { title: "K/D", field: "KD", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.7, headerClick:function(){ScrollToStats();}, formatter:function(cell, formatterParams)
                {
                    var value = cell.getValue();
                    if (value == "999999") value = "&#x221e;";
                    return value;
                }
            },
            {
                title: "Gestorben durch",
                columns: [
                    { title: "Feind", titleDownload: "KilledByFeind", field: "DeathsByEnemy", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToStats();} },
                    { title: "Freund", titleDownload: "KilledByFreund", field: "DeathsByTeammate", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.9, headerClick:function(){ScrollToStats();} },
                ],
            },
            { title: "Flaggen", field: "FlagConquers", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToStats();} },
            { title: "Revives", field: "Revives", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToStats();} },
            { title: "Respawns", field: "Respawns", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1.1, headerClick:function(){ScrollToStats();} },
            {
                title: "Luftfahrt [km]",
                columns: [
                    { title: "Pilot", titleDownload: "DistanzPilot", field: "PilotDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.8, headerClick:function(){ScrollToStats();} },
                    { title: "Passagier", titleDownload: "DistanzPassagier", field: "AirPassengerDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1.1, headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "Landfahrt [km]",
                columns: [
                    { title: "Fahrer", titleDownload: "DistanzFahrer", field: "DriverDistance", editor: "input", hozAlign: "center", widthGrow: 0.8, headerSortStartingDir: "desc", headerClick:function(){ScrollToStats();} },
                    { title: "Mitfahrer", titleDownload: "DistanzMitfahrer", field: "DrivePassengerDistance", editor: "input", hozAlign: "center", widthGrow: 1, headerSortStartingDir: "desc", headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "Seefahrt [km]",
                columns: [
                    { title: "Kapitän", titleDownload: "DistanzKapitaen", field: "BoatDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.9, headerClick:function(){ScrollToStats();} },
                    { title: "Maat", titleDownload: "DistanzMaat", field: "BoatPassengerDistance", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 0.7, headerClick:function(){ScrollToStats();} },
                ],
            },
            {
                title: "Sport [km]",
                columns: [
                    { title: "Laufen", titleDownload: "DistanzLaufen", field: "WalkDistance", editor: "input", hozAlign: "center", widthGrow: 0.9, headerSortStartingDir: "desc", headerClick:function(){ScrollToStats();} },
                    { title: "Swim", titleDownload: "DistanzSchwimmen", field: "SwimDistance", editor: "input", hozAlign: "center", widthGrow: 0.8, headerSortStartingDir: "desc", headerClick:function(){ScrollToStats();} },
                ],
            },
            { title: "Kosten", field: "Cost", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", headerClick:function(){ScrollToStats();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
            {
                title: "L&auml;ngster<br>Schuss [m]", titleDownload: "MaxKillDistance", field: "MaxKillDistance", hozAlign: "left", editor: true, headerSortStartingDir: "desc", widthGrow: 1.2, headerClick:function(){ScrollToStats();}, formatter: "progress", formatterParams: {
                    min: 0,
                    max: 500,
                    color: ["red", "orange", "green"],
                    legend: true,
                    legendColor: "#000000",
                    legendAlign: "center",
                }
            },
            {
                title: "FPS", field: "FPS", hozAlign: "left", editor: true, headerSortStartingDir: "desc", widthGrow: 0.7, headerClick:function(){ScrollToStats();}, formatter: "progress", formatterParams: {
                    min: 10,
                    max: 80,
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

function UpdateElements(resp)
{
    switch (resp.SideSWORD)
    {
        case "NATO":
            ColorSWORD = "blue";
            break;

        case "CSAT":
            ColorSWORD = "red";
            break;

        case "AAF":
            ColorSWORD = "lightgreen";
            break;
    
        default:
            ColorSWORD = "";
    }

    switch (resp.SideARF)
    {
        case "NATO":
            ColorARF = "blue";
            break;

        case "CSAT":
            ColorARF = "red";
            break;

        case "AAF":
            ColorARF = "lightgreen";
            break;
    
        default:
            ColorARF = "";
    }


    document.getElementsByClassName('PunkteText')[0].innerHTML = "Punkte &#187; <span style='color:" + ColorSWORD + "'>SWORD " + resp.Selected_Mission_PointsSWORD + " </span>:<span style='color:" + ColorARF + "'> " + resp.Selected_Mission_PointsARF + " ARF</span>";
    document.getElementsByClassName('BudgetText')[0].innerHTML = "Budget &#187; <span style='color:" + ColorSWORD + "'>SWORD (" + StringToCurrency(resp.StartBudget_SWORD) + " &#10144; " + StringToCurrency(resp.EndBudget_SWORD) + ")</span> &acd; <span style='color:" + ColorARF + "'>ARF (" + StringToCurrency(resp.StartBudget_ARF) + " &#10144; " + StringToCurrency(resp.EndBudget_ARF) + ")</span>";
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
    UpdateElements(resp);
    document.getElementsByClassName('Objektlink')[0].innerHTML = "<a href=objects.html?mission=" + SelectedMissionID + ">Objekt&uuml;bersicht</a>";
}

function MissionSelectorAction(MissionID)
{
    closePopup();
    SelectedMissionID = MissionID;
    $.ajax(
    {
        url: "getdata.php?mission=" + MissionID,
        type: "GET",
        dataType: "json",
        success: function (resp) {
            $("#points").unbind("plothover");
            $("#budget").unbind("plothover");
            show_chartPoints(resp.Points_SWORD, resp.Points_ARF, resp.Points_Conquer, resp.SideSWORD, resp.SideARF);
            show_chartBudget(resp.Budget_SWORD, resp.Budget_ARF, resp.SideSWORD, resp.SideARF);
            stats.clearData();
            stats.setData("stats.php?mission=" + MissionID);
            UpdateElements(resp);
        }
    });
    // Update URL
    history.pushState({}, null, "index.html?mission=" + SelectedMissionID);
    document.getElementsByClassName('Objektlink')[0].innerHTML = "<a href=objects.html?mission=" + MissionID + ">Objekt&uuml;bersicht</a>";
}

window.addEventListener('resize', function ()
{
    stats.redraw();
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
            show_chartPoints(resp.Points_SWORD, resp.Points_ARF, resp.Points_Conquer, resp.SideSWORD, resp.SideARF);
            show_chartBudget(resp.Budget_SWORD, resp.Budget_ARF, resp.SideSWORD, resp.SideARF);
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

            // close Popup
            closePopup();
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

$(document).keydown(function (e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        closePopup();
    }
});

function scrollDisable() {
    if (scrollDisabled) return;
    scrollTop = $(window).scrollTop();
    $('body').addClass('scrollDisabled').css({top: -1 * scrollTop});
    scrollDisabled = true;
}

function scrollEnable() {
    if (!scrollDisabled) return;
    $('body').removeClass('scrollDisabled');
    $(window).scrollTop(scrollTop);
    scrollDisabled = false;
}

/* Open when someone clicks on the span element */
function openPopup() {
    scrollDisable();
    document.getElementById("Popup").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closePopup() {
    document.getElementById("Popup").style.width = "0%";
    scrollEnable();
}

function render_Popup(playerdata) {
    var html = "";
    var rows = 0;

    // Gender
    var er_sie = "er";
    var Er_Sie = "Er";
    var Sein_Ihr = "Sein";
    var ihm_ihr = "ihm";
    var Pilot_Pilotin = "Pilot";
    if (playerdata.Info.PlayerUID == 76561198171657467n || playerdata.Info.PlayerUID == 76561198137678533n || playerdata.Info.PlayerUID == 76561198381160293n)
    {
        var er_sie = "sie";
        var Er_Sie = "Sie";
        var Sein_Ihr = "Ihr";
        var ihm_ihr = "ihr";
        var Pilot_Pilotin = "Pilotin";
    }

    var cost = playerdata.Alltime.Cost;
    var cost_str = Er_Sie + " hat der OPT Kosten in H&ouml;he von ";

    if (cost > 1000000000) cost_str += (cost / 1000000000).toFixed(1) + " Milliarden &euro; verursacht. ";
    else if (cost > 1000000) cost_str += (cost / 1000000).toFixed(1) + " Millionen &euro; verursacht. ";
    else if (cost > 1000) cost_str += (cost / 1000).toFixed(0) + " Tausend &euro; verursacht. ";
    else if (cost > 0.01) cost_str += (cost).toFixed(0) + " &euro; verursacht. ";
    else if (cost > -0.01) cost_str = Er_Sie + " hat sich finanziell bisher aus der OPT herausgehalten. ";
    else if (cost > -1000) cost_str += Math.abs(cost).toFixed(0) + " &euro; eingebracht. ";
    else if (cost > -1000000) cost_str += (Math.abs(cost) / 1000).toFixed(0) + " Tausend &euro; eingebracht. ";
    else if (cost > -1000000000) cost_str += (Math.abs(cost) / 1000000).toFixed(0) + " Millionen &euro; eingebracht. ";
    else if (cost > -1000000000000) cost_str += (Math.abs(cost) / 1000000000).toFixed(0) + " Milliarden &euro; eingebracht. ";
    else cost_str = Er_Sie + " hat irgend ein Geldproblem. ";


    html += "<a href = 'javascript:void(0)' class='closebtn' onclick='closePopup()'>&times;</a>";

    html += "<div class='overlay-content'>";
    html += "<p style='font-size: 18px;margin: 1px;'>All-time Stats (Alle Kampagnen inkl. Testschlachten)</p>";
    html += "<p style='font-size: 15px;margin: 1px;'>" + playerdata.Info.SeenFirst + " &#10144; " + playerdata.Info.SeenLast + "</p>";
    html += "<p style='margin: 1px'>" + playerdata.Info.Nickname + " hat bei der OPT bisher "
        + playerdata.Alltime.Kills + " Feinde sowie "
        + playerdata.Alltime.Teamkills + " Kameraden get&ouml;tet. " + Er_Sie + " wurde "
        + playerdata.Alltime.DeathsByEnemy + "x vom Feind und "
        + playerdata.Alltime.DeathsByTeammate + "x von einem Kameraden umgebracht. Im weiterhin Verlauf hat " + er_sie + " "
        + playerdata.Alltime.FlagConquers + " Flaggen gezogen, "
        + playerdata.Alltime.Vehiclekills + " Fahrzeuge zerst&ouml;rt und "
        + playerdata.Alltime.Revives + " Kameraden wiederbelebt. In aussichtslosen Situationen blieb " + ihm_ihr + " leider nichts anderes &uuml;brig als "
        + playerdata.Alltime.Respawns + "x aufzugeben. "
        + cost_str
        + Sein_Ihr + " weitester Treffer war " + playerdata.Alltime.MaxKillDistance + " Meter entfernt. "
        + "Als " + Pilot_Pilotin + " bef&ouml;rderte " + er_sie + " Kameraden &uuml;ber eine Strecke von insgesamt " + playerdata.Alltime.PilotDistance + " km. Als Passagier flog " + er_sie + " " + playerdata.Alltime.AirPassengerDistance + " km mit."
        + "</p><br>";

    html += "<p style='font-size: 18px;margin: 1px;'>" + playerdata.Info.Nickname + "s Erfahrungen in dieser Schlacht</p>";

    playerdata.Events.forEach(playerevent => {
        if (playerevent.KilledEnemy) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " t&ouml;tete " + playerevent.KilledEnemy + " (Feind)" + (playerevent.KillItem ? (" mit " + playerevent.KillItem) : "") + " (" + playerevent.KillDistance + " m)</p>";
            rows++;
        }

        if (playerevent.KilledByEnemy) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " wurde von " + playerevent.KilledByEnemy + " (Feind)" + (playerevent.KillItem ? (" mit " + playerevent.KillItem) : "") + " get&ouml;tet (" + playerevent.KilledByDistance + " m)</p>";
            rows++;
        }

        if (playerevent.KilledTeammate) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " t&ouml;tete " + playerevent.KilledTeammate + " (Teamkill! &#x26D4;)" + (playerevent.KillItem ? (" mit " + playerevent.KillItem) : "") + " (" + playerevent.KillDistance + " m)</p>";
            rows++;
        }

        if (playerevent.KilledByTeammate) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " wurde von " + playerevent.KilledByTeammate + (playerevent.KillItem ? (" mit " + playerevent.KillItem) : "") + " get&ouml;tet (Teamkill! &#x1F595;) (" + playerevent.KilledByDistance + " m)</p>";
            rows++;
        }

        if (playerevent.RevivedTeammate) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " belebte " + playerevent.RevivedTeammate + " wieder (" + playerevent.RevivedDistance + " m) &#10084;</p>";
            rows++;
        }

        if (playerevent.RevivedByTeammate) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " wurde von " + playerevent.RevivedByTeammate + " wiederbelebt (" + playerevent.RevivedByDistance + " m) &#10084;</p>";
            rows++;
        }

        if (playerevent.FlagDistance) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " zog die Fahne (" + playerevent.FlagDistance + " m) &#9873;</p>";
            rows++;
        }

        if (playerevent.KilledVehicleName) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " zerst&ouml;rte " + playerevent.KilledVehicleName + (playerevent.KillItem ? (" mit " + playerevent.KillItem) : "") + " (" + playerevent.KillDistance + " m) &#128165;</p>";
            rows++;
        }

        if (playerevent.BudgetBuy) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " kaufte " + playerevent.BudgetItem + " (f&uuml;r " + playerevent.BudgetBuy + " &euro;) &#128722;</p>";
            rows++;
        }

        if (playerevent.BudgetSell) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " verkaufte " + playerevent.BudgetItem + " (f&uuml;r " + playerevent.BudgetSell + " &euro;) &#128176;</p>";
            rows++;
        }

        if (playerevent.PilotDistance > 0.2) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " war " + playerevent.PilotDistance + " km als Pilot unterwegs &#128641;</p>";
            rows++;
        }

        if (playerevent.AirPassengerDistance > 0.2) {
            if (playerdata.Info.Nickname != playerevent.TransporterName) html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " wurde von " + playerevent.TransporterName + " eingeflogen (" + playerevent.AirPassengerDistance + " km) &#128641;</p>";
            else html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " flog " + playerevent.Name + " ins Kampfgebiet (" + playerevent.AirPassengerDistance + " km) &#128641;</p>";
            rows++;
        }

        if (playerevent.BoatDistance > 0.2) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " war " + playerevent.BoatDistance + " km als Kapit&auml;n unterwegs &#128741;</p>";
            rows++;
        }

        if (playerevent.BoatPassengerDistance > 0.2) {
            if (playerdata.Info.Nickname != playerevent.TransporterName) html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " wurde von " + playerevent.TransporterName + " verschifft (" + playerevent.BoatPassengerDistance + " km) &#128741;</p>";
            else html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " verschiffte " + playerevent.TransporterName + " ins Kampfgebiet (" + playerevent.BoatPassengerDistance + " km) &#128741;</p>";
            rows++;
        }

        if (playerevent.DriverDistance > 0.2) {
            html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " war " + playerevent.DriverDistance + " km als Fahrer unterwegs &#128661;</p>";
            rows++;
        }

        if (playerevent.DrivePassengerDistance > 0.2) {
            if (playerdata.Info.Nickname != playerevent.TransporterName) html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " wurde von " + playerevent.TransporterName + " gefahren (" + playerevent.DrivePassengerDistance + " km) &#128661;</p>";
            else html += "<p style='margin: 1px'>" + playerevent.Time + " &rArr; " + playerdata.Info.Nickname + " fuhr " + playerevent.Name + " ins Kampfgebiet (" + playerevent.DrivePassengerDistance + " km) &#128661;</p>";
            rows++;
        }
    });

    if (rows == 0) {
        html += "<p style='margin: 1px'>Keine &#9996;</p>";
    }

    html += "    <div class='graphcontainer'>"
    html += "        <div class='graph-container'>"
    html += "            <center>"
    html += "                <p style='color:rgb(255, 255, 255);font-size:18px;'><span class='FPSText'></span></p>"
    html += "            </center>"
    html += "            <div id='fps' class='graph-placeholder'></div>"
    html += "        </div>"
    html += "    </div>"

    html += "</div>"
    document.getElementById("Popup").innerHTML = html;
    show_chartFPS(playerdata);
    openPopup();
}

function show_Popup(PlayerUID) {
    $.ajax(
        {
            url: "player.php?mission=" + SelectedMissionID + "&player=" + PlayerUID,
            type: "GET",
            dataType: "json",
            success: function (playerdata) {
                render_Popup(playerdata);
            }
        });
}

window.onload=function()
{
    document.getElementsByClassName("stats_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("stats_CSV")[0].addEventListener("click", function() { stats.download("csv", MissionNames[SelectedMissionID - 1] + " - Spieler Statistiken.csv"); });
}
