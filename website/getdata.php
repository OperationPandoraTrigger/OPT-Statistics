<?php
if(isset($_GET['mission'])) $SelectedMissionID = htmlspecialchars($_GET["mission"]); 

$db_server = 'localhost';
$db_name = 'opt';
$db_user = 'opt';
$db_passwort = 'optpass';

$dbh = mysqli_connect($db_server, $db_user, $db_passwort); 

if (!$dbh) die("Unable to connect to MySQL: " . mysqli_error($dbh));

//if connection failed output error message 
if (!mysqli_select_db($dbh, $db_name)) die("Unable to select database: " . mysqli_error($dbh)); 

$sql_missions = "SELECT ID, Start, End, Fractions, SideSWORD, SideARF, MissionFileName, CampaignName, MissionName, PointsSWORD, PointsARF FROM Missions ORDER BY Start ASC;";

$result_mission = mysqli_query($dbh, $sql_missions);
if (!$result_mission) die("Database access failed: " . mysqli_error($dbh)); 

$rows = mysqli_num_rows($result_mission); 
if ($rows)
{
    while ($row = mysqli_fetch_array($result_mission))
    {
        $MissionID = $row['ID'];
        $Mission_Start = $row['Start'];
        $Mission_End = $row['End'];
        $Mission_Fractions = $row['Fractions'];
        $Mission_MissionFileName = $row['MissionFileName'];
        $Mission_CampaignName = $row['CampaignName'];
        $Mission_MissionName = $row['MissionName'];
        $MissionData[] = ["ID"=>$row['ID'], "Start"=>$row['Start'], "End"=>$row['End'], "Fractions"=>$row['Fractions'], "MissionFileName"=>$row['MissionFileName'], "CampaignName"=>$row['CampaignName'], "MissionName"=>$row['MissionName'], "MissionPointsSWORD"=>$row['PointsSWORD'], "MissionPointsARF"=>$row['PointsARF']];

        if (!empty($SelectedMissionID))
        {
            if ($MissionID == $SelectedMissionID)
            {
                $Selected_Mission_Start = $Mission_Start;
                $Selected_Mission_End = $Mission_End;
                $Selected_SideSWORD = $row['SideSWORD'];
                $Selected_SideARF = $row['SideARF'];
                $Selected_Mission_PointsSWORD = $row['PointsSWORD'];
                $Selected_Mission_PointsARF = $row['PointsARF'];
            }
        }

        else
        {
            $Selected_Mission_Start = $Mission_Start;
            $Selected_Mission_End = $Mission_End;
            $Selected_SideSWORD = $row['SideSWORD'];
            $Selected_SideARF = $row['SideARF'];
            $Selected_Mission_PointsSWORD = $row['PointsSWORD'];
            $Selected_Mission_PointsARF = $row['PointsARF'];
        }
        
    }
}
else die("No missions found.");

// Punkte
$sql_points = "SELECT Time, PointsSWORD, PointsARF FROM Events WHERE Time BETWEEN '$Selected_Mission_Start' AND '$Selected_Mission_End' AND PointsSWORD IS NOT NULL ORDER BY Time ASC;";
$sql_conquer = "SELECT Time, CONCAT(Nickname, ' zieht die Fahne aus ', ROUND(FlagDistance, 1), 'm Entfernung') AS Text FROM Events INNER JOIN Players ON Events.PlayerUID = Players.SteamID64 WHERE Time BETWEEN '$Selected_Mission_Start' AND '$Selected_Mission_End' AND FlagDistance IS NOT NULL ORDER BY Time ASC;";

$result_points = mysqli_query($dbh, $sql_points);
if (!$result_points) die("Database access failed: " . mysqli_error($dbh)); 

$result_conquer = mysqli_query($dbh, $sql_conquer);
if (!$result_conquer) die("Database access failed: " . mysqli_error($dbh)); 

$rows_points = mysqli_num_rows($result_points); 
if ($rows_points)
{
    while ($row_points = mysqli_fetch_array($result_points))
    {
        $Points_SWORD[] = [strtotime($row_points['Time']) * 1000, $row_points['PointsSWORD']];
        $Points_ARF[] = [strtotime($row_points['Time']) * 1000, $row_points['PointsARF']];
    }
}

$rows_conquer = mysqli_num_rows($result_conquer); 
if ($rows_conquer)
{
    while ($row_conquer = mysqli_fetch_array($result_conquer))
    {
        $Points_conquer[] = [strtotime($row_conquer['Time']) * 1000, 0, $row_conquer['Text']];
    }
}

// Budget
$sql_SWORD = "SELECT Time, BudgetSWORD, CONCAT(Nickname, CAST(CASE WHEN BudgetSell IS NOT NULL THEN ' verkauft ' ELSE ' kauft ' END AS CHAR), BudgetItem, ' für ', COALESCE(BudgetSell, BudgetBuy), '€') AS Text FROM Events INNER JOIN Players ON Events.PlayerUID = Players.SteamID64 WHERE Time BETWEEN '$Selected_Mission_Start' AND '$Selected_Mission_End' AND PlayerSide = '$Selected_SideSWORD' AND BudgetItem IS NOT NULL ORDER BY Time ASC;";
$sql_ARF = "SELECT Time, BudgetARF, CONCAT(Nickname, CAST(CASE WHEN BudgetSell IS NOT NULL THEN ' verkauft ' ELSE ' kauft ' END AS CHAR), BudgetItem, ' für ', COALESCE(BudgetSell, BudgetBuy), '€') AS Text FROM Events INNER JOIN Players ON Events.PlayerUID = Players.SteamID64 WHERE Time BETWEEN '$Selected_Mission_Start' AND '$Selected_Mission_End' AND PlayerSide = '$Selected_SideARF' AND BudgetItem IS NOT NULL ORDER BY Time ASC;";

$result_SWORD = mysqli_query($dbh, $sql_SWORD);
if (!$result_SWORD) die("Database access failed: " . mysqli_error($dbh)); 

$result_ARF = mysqli_query($dbh, $sql_ARF);
if (!$result_ARF) die("Database access failed: " . mysqli_error($dbh)); 

$rows_SWORD = mysqli_num_rows($result_SWORD); 
$Budget_SWORD[] = [];
$StartBudget_SWORD = NULL;
if ($rows_SWORD)
{
    while ($row = mysqli_fetch_array($result_SWORD))
    {
        $Budget_SWORD[] = [strtotime($row['Time']) * 1000, $row['BudgetSWORD'], $row['Text']];
        $EndBudget_SWORD = $row['BudgetSWORD'];
        if (is_null($StartBudget_SWORD)) $StartBudget_SWORD = $row['BudgetSWORD'];
    }
}

$rows_ARF = mysqli_num_rows($result_ARF); 
$Budget_ARF[] = [];
$StartBudget_ARF = NULL;
if ($rows_ARF)
{
    while ($row = mysqli_fetch_array($result_ARF))
    {
        $Budget_ARF[] = [strtotime($row['Time']) * 1000, $row['BudgetARF'], $row['Text']];
        $EndBudget_ARF = $row['BudgetARF'];
        if (is_null($StartBudget_ARF)) $StartBudget_ARF = $row['BudgetARF'];
    }
}

// Kampagnenpunkte
$sql_CampaignPoints = "SELECT SUM(PointsSWORD) AS PointsSWORD, SUM(PointsARF) AS PointsARF from Missions WHERE Rated = True AND CampaignName LIKE '$Mission_CampaignName';";

$result_CampaignPoints = mysqli_query($dbh, $sql_CampaignPoints);
if (!$result_CampaignPoints) die("Database access failed: " . mysqli_error($dbh)); 

$rows_CampaignPoints = mysqli_num_rows($result_CampaignPoints); 
if ($rows_CampaignPoints)
{
    while ($row = mysqli_fetch_array($result_CampaignPoints))
    {
        $CampaignPoints[] = ["PointsSWORD"=>$row['PointsSWORD'], "PointsARF"=>$row['PointsARF']];
    }
}

// Output
echo json_encode(array("MissionData"=>$MissionData, "Points_SWORD"=>$Points_SWORD, "Points_ARF"=>$Points_ARF, "Points_Conquer"=>$Points_conquer, "Budget_SWORD"=>$Budget_SWORD, "Budget_ARF"=>$Budget_ARF, "CampaignPoints"=>$CampaignPoints, "Selected_Mission_PointsSWORD"=>$Selected_Mission_PointsSWORD, "Selected_Mission_PointsARF"=>$Selected_Mission_PointsARF, "StartBudget_SWORD"=>$StartBudget_SWORD, "StartBudget_ARF"=>$StartBudget_ARF, "EndBudget_SWORD"=>$EndBudget_SWORD, "EndBudget_ARF"=>$EndBudget_ARF, "SideSWORD"=>$Selected_SideSWORD, "SideARF"=>$Selected_SideARF));
mysqli_close($dbh);
?>
