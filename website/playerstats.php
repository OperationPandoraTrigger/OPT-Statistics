<?php
    if(isset($_GET['campaign'])) $SelectedCampaignID = htmlspecialchars($_GET["campaign"]); 

    if (!empty($SelectedCampaignID)) $cachefile = sprintf('cache/playerstats_campaign_%04d.json', $SelectedCampaignID);
    else $cachefile = 'cache/playerstats.json';

    if (file_exists($cachefile))
    {
        $result = file_get_contents($cachefile);
        echo $result;
        exit(0);
    }

    $db_server = 'localhost';
    $db_name = 'opt';
    $db_user = 'opt';
    $db_passwort = 'optpass';

    $dbh = mysqli_connect($db_server, $db_user, $db_passwort); 

    if (!$dbh) die("Unable to connect to MySQL: " . mysqli_error($dbh));

    //if connection failed output error message 
    if (!mysqli_select_db($dbh, $db_name)) die("Unable to select database: " . mysqli_error($dbh)); 

    // Kampagnenauswahl
    $sql_campaigns = "SELECT ID, CampaignName FROM Campaigns ORDER BY ID ASC;";

    $result_campaigns = mysqli_query($dbh, $sql_campaigns);
    if (!$result_campaigns) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result_campaigns); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result_campaigns))
        {
            $CampaignID = $row['ID'];
            $CampaignName = $row['CampaignName'];
            $CampaignData[] = ["ID"=>$row['ID'], "CampaignName"=>$row['CampaignName']];

            if (!empty($SelectedCampaignID))
            {
                if ($CampaignID == $SelectedCampaignID)
                {
                    $Selected_Campaign = $CampaignName;
                    break;
                }
            }
            else
            {
                    $Selected_Campaign = $CampaignName;
            }
        }
    }
    else die("No campaigns found.");

    $sql = "SELECT ID FROM Missions WHERE Rated = TRUE AND CampaignName = '$Selected_Campaign' ORDER BY Start;";

    $result = mysqli_query($dbh, $sql);
    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
            $MissionIDs[] = $row['ID'];
        }
    }
    else die("Wrong number of missions.");

    $sql_stmt = "WITH Contributions AS (SELECT PlayerUID, MissionID FROM Events GROUP BY PlayerUID, MissionID ) SELECT E.PlayerUID, P.Nickname AS Name, E.PlayerSide, IF(E.PlayerUID, COUNT(E.KilledEnemy), 0) AS Kills, IF(E.PlayerUID, COUNT(E.KilledTeammate), 0) AS Teamkills, IF(E.PlayerUID, COUNT(E.KilledByEnemy), 0) AS DeathsByEnemy, IF(E.PlayerUID, COUNT(E.KilledByTeammate), 0) AS DeathsByTeammate, IF(E.PlayerUID, COUNT(E.FlagDistance), 0) AS FlagConquers, IF(E.PlayerUID, COUNT(E.KilledVehicleName), 0) AS Vehiclekills, IF(E.PlayerUID, COUNT(E.RevivedTeammate), 0) AS Revives, IF(E.PlayerUID, (COUNT(E.RespawnClick) + COUNT(RespawnTimeout)), 0) AS Respawns, IF(E.PlayerUID, (IFNULL(SUM(E.BudgetBuy), 0) - IFNULL(SUM(BudgetSell), 0)), 0) AS Cost, IF(E.PlayerUID, ROUND(MAX(E.KillDistance)), 0) AS MaxKillDistance, ROUND(AVG(E.FPS), 1) AS FPS, ROUND(IFNULL(SUM(E.PilotDistance), 0) / 1000, 0) AS PilotDistance, ROUND(IFNULL(SUM(E.AirPassengerDistance), 0) / 1000, 0) AS AirPassengerDistance, ROUND(IFNULL(SUM(E.DriverDistance), 0) / 1000, 0) AS DriverDistance, ROUND(IFNULL(SUM(E.DrivePassengerDistance), 0) / 1000, 0) AS DrivePassengerDistance, ROUND((IF(E.PlayerUID, COUNT(E.KilledEnemy), 0) / IF(E.PlayerUID, COUNT(E.KilledByEnemy), 0)), 1) AS KD, (SELECT COUNT(*) FROM Contributions C WHERE C.PlayerUID = E.PlayerUID GROUP BY C.PlayerUID) AS Participations FROM Events E INNER JOIN Players P ON E.PlayerUID = P.SteamID64 WHERE E.MissionID IN (" . implode(',', array_map('intval', $MissionIDs)) . ") AND E.PlayerUID IS NOT NULL GROUP BY E.PlayerUID ORDER BY Kills DESC;";

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
            'KD' => $KD,
            'Participations' => $row["Participations"]
        );
        }
        $result = json_encode($data);
        echo $result;
        file_put_contents($cachefile, $result);
    }
    mysqli_close($dbh);
?>
