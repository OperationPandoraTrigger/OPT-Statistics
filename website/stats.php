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

    if (empty($SelectedMissionID)) $sql_missions = "SELECT ID, Start, End, Fractions, MissionFileName, CampaignName, MissionName FROM Missions ORDER BY Start DESC LIMIT 1;";
    else $sql_missions = "SELECT ID, Start, End, Fractions, MissionFileName, CampaignName, MissionName FROM Missions WHERE ID = $SelectedMissionID LIMIT 1;";

    $result_mission = mysqli_query($dbh, $sql_missions);
    if (!$result_mission) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result_mission); 
    if ($rows == 1)
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
        }
    }
    else die("Wrong number of missions.");

    $sql_stmt = "SELECT PlayerUID, Nickname AS Name, PlayerSide, IF(PlayerUID, COUNT(KilledEnemy), 0) AS Kills, IF(PlayerUID, COUNT(KilledTeammate), 0) AS Teamkills, IF(PlayerUID, COUNT(KilledByEnemy), 0) AS DeathsByEnemy, IF(PlayerUID, COUNT(KilledByTeammate), 0) AS DeathsByTeammate, IF(PlayerUID, COUNT(FlagDistance), 0) AS FlagConquers, IF(PlayerUID, COUNT(KilledVehicleName), 0) AS Vehiclekills, IF(PlayerUID, COUNT(RevivedTeammate), 0) AS Revives, IF(PlayerUID, (COUNT(RespawnClick) + COUNT(RespawnTimeout)), 0) AS Respawns, IF(PlayerUID, (IFNULL(SUM(BudgetBuy), 0) - IFNULL(SUM(BudgetSell), 0)), 0) AS Cost, IF(PlayerUID, ROUND(MAX(KillDistance)), 0) AS MaxKillDistance, ROUND(AVG(FPS), 1) AS FPS, ROUND(IFNULL(SUM(PilotDistance), 0) / 1000, 0) AS PilotDistance, ROUND(IFNULL(SUM(AirPassengerDistance), 0) / 1000, 0) AS AirPassengerDistance, ROUND(IFNULL(SUM(DriverDistance), 0) / 1000, 0) AS DriverDistance, ROUND(IFNULL(SUM(DrivePassengerDistance), 0) / 1000, 0) AS DrivePassengerDistance, ROUND(IFNULL(SUM(BoatDistance), 0) / 1000, 0) AS BoatDistance, ROUND(IFNULL(SUM(BoatPassengerDistance), 0) / 1000, 0) AS BoatPassengerDistance, ROUND(IFNULL(SUM(SwimDistance), 0) / 1000, 0) AS SwimDistance, ROUND(IFNULL(SUM(WalkDistance), 0) / 1000, 0) AS WalkDistance, ROUND((IF(PlayerUID, COUNT(KilledEnemy), 0) / IF(PlayerUID, COUNT(KilledByEnemy), 0)), 1) AS KD FROM Events INNER JOIN Players ON Events.PlayerUID = Players.SteamID64 WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND PlayerUID IS NOT NULL GROUP BY PlayerUID ORDER BY Kills DESC;";

    $result = mysqli_query($dbh, $sql_stmt);

    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
            $KD = "0.0";
            if ($row["Kills"] > 0)
            {
                $KD = is_null($row["KD"]) ? "999999" : $row["KD"];
            }

            $data[] = array(
            'PlayerUID' => $row["PlayerUID"],
            'Name' => $row["Name"],
            'PlayerSide' => $row["PlayerSide"],
            'Kills' => $row["Kills"],
            'Teamkills' => $row["Teamkills"],
            'DeathsByEnemy' => $row["DeathsByEnemy"],
            'DeathsByTeammate' => $row["DeathsByTeammate"],
            'FlagConquers' => $row["FlagConquers"],
            'Vehiclekills' => $row["Vehiclekills"],
            'Revives' => $row["Revives"],
            'Respawns' => $row["Respawns"],
            'Cost' => $row["Cost"],
            'MaxKillDistance' => $row["MaxKillDistance"],
            'FPS' => $row["FPS"],
            'PilotDistance' => $row["PilotDistance"],
            'AirPassengerDistance' => $row["AirPassengerDistance"],
            'DriverDistance' => $row["DriverDistance"],
            'DrivePassengerDistance' => $row["DrivePassengerDistance"],
            'BoatDistance' => $row['BoatDistance'],
            'BoatPassengerDistance' => $row['BoatPassengerDistance'],
            'SwimDistance' => $row['SwimDistance'],
            'WalkDistance' => $row['WalkDistance'],
            'KD' => $KD
        );
        }
        echo json_encode($data);
    }
    mysqli_close($dbh);
?>
