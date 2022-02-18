var points, budget, stats, playerstats;
var objects, objectcategories_SWORD, objectcategories_ARF, objectitems_SWORD, objectitems_ARF, objectcategories_SWORD2, objectcategories_ARF2, objectitems_SWORD2, objectitems_ARF2;
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
            { title: "Spieler", field: "NumPlayers", editor: "input", headerSortStartingDir: "asc", widthGrow: 1, hozAlign:"center", headerClick:function(){ScrollToStats();} }
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

// ----- ObjectCategories -----

function show_ObjectCategories_SWORD() {
    campaignobjectcategories_SWORD = new Tabulator("#campaignobjectcategories_SWORD", {
        ajaxURL: "campaignobjectcategories.php?campaign=" + SelectedCampaignID + "&side=NATO&halftime=1",
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

function show_ObjectCategories_SWORD2() {
    campaignobjectcategories_SWORD2 = new Tabulator("#campaignobjectcategories_SWORD2", {
        ajaxURL: "campaignobjectcategories.php?campaign=" + SelectedCampaignID + "&side=CSAT&halftime=2",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

function show_ObjectCategories_ARF() {
    campaignobjectcategories_ARF = new Tabulator("#campaignobjectcategories_ARF", {
        ajaxURL: "campaignobjectcategories.php?campaign=" + SelectedCampaignID + "&side=CSAT&halftime=1",
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

function show_ObjectCategories_ARF2() {
    campaignobjectcategories_ARF2 = new Tabulator("#campaignobjectcategories_ARF2", {
        ajaxURL: "campaignobjectcategories.php?campaign=" + SelectedCampaignID + "&side=NATO&halftime=2",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectCategories2();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

// ----- ObjectItems -----

function show_ObjectItems_SWORD() {
    campaignobjectitems_SWORD = new Tabulator("#campaignobjectitems_SWORD", {
        ajaxURL: "campaignobjectitems.php?campaign=" + SelectedCampaignID + "&side=NATO&halftime=1",
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

function show_ObjectItems_SWORD2() {
    campaignobjectitems_SWORD2 = new Tabulator("#campaignobjectitems_SWORD2", {
        ajaxURL: "campaignobjectitems.php?campaign=" + SelectedCampaignID + "&side=CSAT&halftime=2",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Produkt", field: "Name", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 3, headerClick:function(){ScrollToObjectItems2();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();} },
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

function show_ObjectItems_ARF() {
    campaignobjectitems_ARF = new Tabulator("#campaignobjectitems_ARF", {
        ajaxURL: "campaignobjectitems.php?campaign=" + SelectedCampaignID + "&side=CSAT&halftime=1",
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

function show_ObjectItems_ARF2() {
    campaignobjectitems_ARF2 = new Tabulator("#campaignobjectitems_ARF2", {
        ajaxURL: "campaignobjectitems.php?campaign=" + SelectedCampaignID + "&side=NATO&halftime=2",
        layout: "fitColumns",
        virtualDom:false,
        initialSort: [
            { column: "Percentage", dir: "desc" },
        ],
        columnHeaderVertAlign: "middle",
        selectable: false,
        columns: [
            { title: "Produkt", field: "Name", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 3, headerClick:function(){ScrollToObjectItems2();} },
            { title: "Anzahl", field: "Amount", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();} },
            { title: "Kategorie", field: "Category", editor: "input", hozAlign: "center", headerSortStartingDir: "asc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();} },
            {
                title: "Kosten",
                columns: [
                    { title: "Preis", field: "Price", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();}, formatter:function(cell, formatterParams){return StringToCurrency(cell.getValue());}},
                    { title: "Anteil", field: "Percentage", editor: "input", hozAlign: "center", headerSortStartingDir: "desc", widthGrow: 1, headerClick:function(){ScrollToObjectItems2();}, formatter:function(cell, formatterParams){return cell.getValue() + " %";} },
                ],
            },
        ],
    });
}

// ----- Objects -----

function show_Objects() {
    campaignobjects = new Tabulator("#campaignobjects", {
        ajaxURL: "campaignobjects.php?campaign=" + SelectedCampaignID,
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
                show_chartPoints(resp.Points_SWORD, resp.Points_SumSWORD, resp.Points_ARF, resp.Points_SumARF, resp.Points_MissionName);
                stats.clearData();
                stats.setData("campaignmissions.php?campaign=" + CampaignID);
                playerstats.clearData();
                playerstats.setData("playerstats.php?campaign=" + CampaignID);

                campaignobjectcategories_SWORD.clearData();
                campaignobjectcategories_SWORD.setData("campaignobjectcategories.php?campaign=" + CampaignID + "&side=NATO&halftime=1");
                campaignobjectcategories_ARF.clearData();
                campaignobjectcategories_ARF.setData("campaignobjectcategories.php?campaign=" + CampaignID + "&side=CSAT&halftime=1");
                campaignobjectitems_SWORD.clearData();
                campaignobjectitems_SWORD.setData("campaignobjectitems.php?campaign=" + CampaignID + "&side=NATO&halftime=1");
                campaignobjectitems_ARF.clearData();
                campaignobjectitems_ARF.setData("campaignobjectitems.php?campaign=" + CampaignID + "&side=CSAT&halftime=1");

                campaignobjectcategories_SWORD2.clearData();
                campaignobjectcategories_SWORD2.setData("campaignobjectcategories.php?campaign=" + CampaignID + "&side=CSAT&halftime=2");
                campaignobjectcategories_ARF2.clearData();
                campaignobjectcategories_ARF2.setData("campaignobjectcategories.php?campaign=" + CampaignID + "&side=NATO&halftime=2");
                campaignobjectitems_SWORD2.clearData();
                campaignobjectitems_SWORD2.setData("campaignobjectitems.php?campaign=" + CampaignID + "&side=CSAT&halftime=2");
                campaignobjectitems_ARF2.clearData();
                campaignobjectitems_ARF2.setData("campaignobjectitems.php?campaign=" + CampaignID + "&side=NATO&halftime=2");

//                campaignobjects.clearData();
//                campaignobjects.setData("campaignobjects.php?campaign=" + CampaignID);                
            }
        });
}

window.addEventListener('resize', function () {
    stats.redraw();
    playerstats.redraw();

    campaignobjectcategories_SWORD.redraw();
    campaignobjectcategories_ARF.redraw();
    campaignobjectitems_SWORD.redraw();
    campaignobjectitems_ARF.redraw();

    campaignobjectcategories_SWORD2.redraw();
    campaignobjectcategories_ARF2.redraw();
    campaignobjectitems_SWORD2.redraw();
    campaignobjectitems_ARF2.redraw();

    //    campaignobjects.redraw();
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

                show_ObjectCategories_SWORD();
                show_ObjectCategories_ARF();
                show_ObjectItems_SWORD();
                show_ObjectItems_ARF();
//                show_Objects();                

                show_ObjectCategories_SWORD2();
                show_ObjectCategories_ARF2();
                show_ObjectItems_SWORD2();
                show_ObjectItems_ARF2();
//                show_Objects2();                
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

function ScrollToObjectCategories() {
    $('html, body').animate({
        scrollTop: $(".objectcategorycontainer").offset().top - 36
    }, 300, function () {});
}

function ScrollToObjectCategories2() {
    $('html, body').animate({
        scrollTop: $(".objectcategorycontainer2").offset().top - 36
    }, 300, function () {});
}

function ScrollToObjectItems() {
    $('html, body').animate({
        scrollTop: $(".objectitemscontainer").offset().top - 36
    }, 300, function () {});
}

function ScrollToObjectItems2() {
    $('html, body').animate({
        scrollTop: $(".objectitemscontainer2").offset().top - 36
    }, 300, function () {});
}

function ScrollToObjects() {
    $('html, body').animate({
        scrollTop: $(".objectscontainer").offset().top - 36
    }, 300, function () {});
}

window.onload=function()
{
    document.getElementsByClassName("campaigns_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaigns_CSV")[0].addEventListener("click", function() { stats.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Gespielte Schlachten.csv"); });
    document.getElementsByClassName("campaignplayers_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignplayers_CSV")[0].addEventListener("click", function() { playerstats.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Spielerpunkte.csv"); });

    document.getElementsByClassName("campaignobjectcategories_SWORD_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectcategories_SWORD_CSV")[0].addEventListener("click", function() { campaignobjectcategories_SWORD.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Kategorien SWORD (HZ 1).csv"); });

    document.getElementsByClassName("campaignobjectcategories_ARF_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectcategories_ARF_CSV")[0].addEventListener("click", function() { campaignobjectcategories_ARF.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Kategorien ARF (HZ 1).csv"); });

    document.getElementsByClassName("campaignobjectitems_SWORD_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectitems_SWORD_CSV")[0].addEventListener("click", function() { campaignobjectitems_SWORD.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Typen SWORD (HZ 1).csv"); });

    document.getElementsByClassName("campaignobjectitems_ARF_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectitems_ARF_CSV")[0].addEventListener("click", function() { campaignobjectitems_ARF.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Typen ARF (HZ 1).csv"); });


    document.getElementsByClassName("campaignobjectcategories_SWORD2_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectcategories_SWORD2_CSV")[0].addEventListener("click", function() { campaignobjectcategories_SWORD2.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Kategorien SWORD (HZ 2).csv"); });

    document.getElementsByClassName("campaignobjectcategories_ARF2_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectcategories_ARF2_CSV")[0].addEventListener("click", function() { campaignobjectcategories_ARF2.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Kategorien ARF (HZ 2).csv"); });

    document.getElementsByClassName("campaignobjectitems_SWORD2_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectitems_SWORD2_CSV")[0].addEventListener("click", function() { campaignobjectitems_SWORD2.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Typen SWORD (HZ 2).csv"); });

    document.getElementsByClassName("campaignobjectitems_ARF2_CSV")[0].style.cursor = 'pointer';
    document.getElementsByClassName("campaignobjectitems_ARF2_CSV")[0].addEventListener("click", function() { campaignobjectitems_ARF2.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekt Typen ARF (HZ 2).csv"); });

//    document.getElementsByClassName("campaignobjects_CSV")[0].style.cursor = 'pointer';
//    document.getElementsByClassName("campaignobjects_CSV")[0].addEventListener("click", function() { campaignobjects.download("csv", Kampagnenname[SelectedCampaignID-1] + " - Kampagnen Objekte Einzeln.csv"); });    

}
