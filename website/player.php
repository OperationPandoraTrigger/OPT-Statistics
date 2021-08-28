<?php
    if (isset($_GET['mission']) && isset($_GET['player']))
    {
        $SelectedMissionID = htmlspecialchars($_GET["mission"]); 
        $PlayerUID = htmlspecialchars($_GET["player"]); 
    }
    else die ("Missing parameters.");

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



    $sql_playerinfo = "SELECT SteamID64, Nickname, SeenFirst, SeenLast FROM Players WHERE SteamID64 = $PlayerUID;";
    $result_playerinfo = mysqli_query($dbh, $sql_playerinfo);
    if (!$result_playerinfo) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result_playerinfo); 
    if ($rows == 1)
    {
        while ($row = mysqli_fetch_array($result_playerinfo))
        {
            $info = array(
                'PlayerUID' => $row['SteamID64'],
                'Nickname' => $row['Nickname'],
                'SeenFirst' => $row['SeenFirst'],
                'SeenLast' => $row['SeenLast']
            );
        }
    }
    else die("Player not found.");


    $sql_alltime = "SELECT COUNT(KilledEnemy) AS Kills, COUNT(KilledTeammate) AS Teamkills, COUNT(KilledByEnemy) AS DeathsByEnemy, COUNT(KilledByTeammate) AS DeathsByTeammate, COUNT(FlagDistance) AS FlagConquers, COUNT(KilledVehicleName) AS Vehiclekills, COUNT(RevivedTeammate) AS Revives, COUNT(RevivedByTeammate) AS RevivesBy, (COUNT(RespawnClick) + COUNT(RespawnTimeout)) AS Respawns, IFNULL(SUM(BudgetBuy), 0) - IFNULL(SUM(BudgetSell), 0) AS Cost, ROUND(MAX(KillDistance)) AS MaxKillDistance, ROUND(IFNULL(SUM(PilotDistance), 0) / 1000, 0) AS PilotDistance, ROUND(IFNULL(SUM(AirPassengerDistance), 0) / 1000, 0) AS AirPassengerDistance, ROUND(IFNULL(SUM(BoatDistance), 0) / 1000, 0) AS BoatDistance, ROUND(IFNULL(SUM(BoatPassengerDistance), 0) / 1000, 0) AS BoatPassengerDistance, ROUND(IFNULL(SUM(DriverDistance), 0) / 1000, 0) AS DriverDistance, ROUND(IFNULL(SUM(DrivePassengerDistance), 0) / 1000, 0) AS DrivePassengerDistance, ROUND(IFNULL(SUM(SwimDistance), 0) / 1000, 0) AS SwimDistance, ROUND(IFNULL(SUM(WalkDistance), 0) / 1000, 0) AS WalkDistance FROM Events WHERE PlayerUID = $PlayerUID;";
    $result_alltime = mysqli_query($dbh, $sql_alltime);
    if (!$result_alltime) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result_alltime); 
    if ($rows == 1)
    {
        while ($row = mysqli_fetch_array($result_alltime))
        {
            $alltime = array(
                'Kills' => $row['Kills'],
                'Teamkills' => $row['Teamkills'],
                'DeathsByEnemy' => $row['DeathsByEnemy'],
                'DeathsByTeammate' => $row['DeathsByTeammate'],
                'FlagConquers' => $row['FlagConquers'],
                'Vehiclekills' => $row['Vehiclekills'],
                'Revives' => $row['Revives'],
                'RevivesBy' => $row['RevivesBy'],
                'Respawns' => $row['Respawns'],
                'Cost' => $row['Cost'],
                'MaxKillDistance' => $row['MaxKillDistance'],
                'PilotDistance' => $row['PilotDistance'],
                'AirPassengerDistance' => $row['AirPassengerDistance'],
                'BoatDistance' => $row['BoatDistance'],
                'BoatPassengerDistance' => $row['BoatPassengerDistance'],
                'DriverDistance' => $row['DriverDistance'],
                'DrivePassengerDistance' => $row['DrivePassengerDistance'],
                'SwimDistance' => $row['SwimDistance'],
                'WalkDistance' => $row['WalkDistance']
            );
        }
    }
    else die("Player not found.");

    $sql_stmt = "SELECT Time, Player.Nickname AS Name, PlayerSide, KilledEnemy.Nickname AS KilledEnemy, KilledByEnemy.Nickname AS KilledByEnemy, KilledTeammate.Nickname AS KilledTeammate, KilledByTeammate.Nickname AS KilledByTeammate, KillItem, KilledVehicleName, ROUND(KillDistance, 1) AS KillDistance, ROUND(KilledByDistance, 1) AS KilledByDistance, RevivedTeammate.Nickname AS RevivedTeammate, RevivedByTeammate.Nickname AS RevivedByTeammate, ROUND(RevivedDistance, 1) AS RevivedDistance, ROUND(RevivedByDistance, 1) AS RevivedByDistance, ROUND(FlagDistance, 1) AS FlagDistance, BudgetItem, BudgetBuy, BudgetSell, ROUND(PilotDistance / 1000, 1) AS PilotDistance, ROUND(AirPassengerDistance / 1000, 1) AS AirPassengerDistance, ROUND(BoatDistance / 1000, 1) AS BoatDistance, ROUND(BoatPassengerDistance / 1000, 1) AS BoatPassengerDistance, ROUND(DriverDistance / 1000, 1) AS DriverDistance, ROUND(DrivePassengerDistance / 1000, 1) AS DrivePassengerDistance, ROUND(SwimDistance / 1000, 1) AS SwimDistance, ROUND(WalkDistance / 1000, 1) AS WalkDistance, TransporterUID.Nickname AS TransporterName, PassengerUID.Nickname AS PassengerName FROM Events LEFT JOIN Players AS Player ON Events.PlayerUID = Player.SteamID64 LEFT JOIN Players AS KilledEnemy ON Events.KilledEnemy = KilledEnemy.SteamID64 LEFT JOIN Players AS KilledByEnemy ON Events.KilledByEnemy = KilledByEnemy.SteamID64 LEFT JOIN Players AS KilledTeammate ON Events.KilledTeammate = KilledTeammate.SteamID64 LEFT JOIN Players AS KilledByTeammate ON Events.KilledByTeammate = KilledByTeammate.SteamID64 LEFT JOIN Players AS RevivedTeammate ON Events.RevivedTeammate = RevivedTeammate.SteamID64 LEFT JOIN Players AS RevivedByTeammate ON Events.RevivedByTeammate = RevivedByTeammate.SteamID64 LEFT JOIN Players AS TransporterUID ON Events.TransporterUID = TransporterUID.SteamID64 LEFT JOIN Players AS PassengerUID ON Events.PassengerUID = PassengerUID.SteamID64 WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND PlayerUID = $PlayerUID ORDER BY Time ASC;";

    $result = mysqli_query($dbh, $sql_stmt);

    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
            $events[] = array(
                'Time' => $row["Time"],
                'Name' => $row["Name"],
                'PlayerSide' => $row["PlayerSide"],
                'KilledEnemy' => $row["KilledEnemy"],
                'KilledByEnemy' => $row["KilledByEnemy"],
                'KilledTeammate' => $row["KilledTeammate"],
                'KilledByTeammate' => $row["KilledByTeammate"],
                'KillItem' => $row["KillItem"],
                'KilledVehicleName' => $row["KilledVehicleName"],
                'KillDistance' => $row["KillDistance"],
                'KilledByDistance' => $row["KilledByDistance"],
                'RevivedTeammate' => $row["RevivedTeammate"],
                'RevivedByTeammate' => $row["RevivedByTeammate"],
                'RevivedDistance' => $row["RevivedDistance"],
                'RevivedByDistance' => $row["RevivedByDistance"],
                'FlagDistance' => $row["FlagDistance"],
                'BudgetItem' => $row["BudgetItem"],
                'BudgetBuy' => $row["BudgetBuy"],
                'BudgetSell' => $row["BudgetSell"],
                'PilotDistance' => $row["PilotDistance"],
                'AirPassengerDistance' => $row["AirPassengerDistance"],
                'BoatDistance' => $row["BoatDistance"],
                'BoatPassengerDistance' => $row["BoatPassengerDistance"],
                'DriverDistance' => $row['DriverDistance'],
                'DrivePassengerDistance' => $row['DrivePassengerDistance'],
                'SwimDistance' => $row["SwimDistance"],
                'WalkDistance' => $row["WalkDistance"],
                'TransporterName' => $row["TransporterName"],
                'PassengerName' => $row["PassengerName"]
            );
        }
    }

    // FPS
    $sql_fps = "SELECT Time, FPS FROM FPS WHERE PlayerUID = $PlayerUID AND Time BETWEEN '$Mission_Start' AND '$Mission_End' ORDER BY Time ASC;";
    $result_fps = mysqli_query($dbh, $sql_fps);
    if (!$result_fps) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result_fps); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result_fps))
        {
            $FPS[] = [strtotime($row['Time']) * 1000, $row['FPS']];
        }
    }
    else die("Player not found.");

    echo json_encode(array("Info"=>$info, "Alltime"=>$alltime, "Events"=>$events, "FPS"=>$FPS));
    mysqli_close($dbh);
?>
