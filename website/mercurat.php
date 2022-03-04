<?php
    if(isset($_GET['campaign'])) $SelectedCampaignID = htmlspecialchars($_GET["campaign"]); 

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

    $sql_missions = "SELECT ID, Start, End, REPLACE(MissionName, 'Schlacht ', '') AS Schlacht, DATE_FORMAT(Start, '%W') AS Weekday, PointsSWORD, PointsARF, NumPlayers, SideSWORD, SideARF from Missions WHERE CampaignName = '$Selected_Campaign' AND Rated = True;";

    $result = mysqli_query($dbh, $sql_missions);

    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
            $MissionID = $row['ID'];
            $Mission_Start = $row['Start'];
            $Mission_End = $row['End'];            
            $Schlacht = $row['Schlacht'];
            $Weekday = $row['Weekday'];
            $PointsSWORD = $row['PointsSWORD'];
            $PointsARF = $row['PointsARF'];
            $NumPlayers = $row['NumPlayers'];
            $SideSWORD = $row['SideSWORD'];
            $SideARF = $row['SideARF'];

            $sql_mission = "SELECT IFNULL(COUNT(KilledEnemy), 0) AS Kills, IFNULL(COUNT(KilledByEnemy), 0) AS Deaths, IFNULL(SUM(BudgetBuy),0) - IFNULL(SUM(BudgetSell),0) AS Budget FROM Events WHERE MissionID = '$MissionID' AND (PlayerSide = 'NATO' OR PlayerSide = 'CSAT') GROUP BY PlayerSide ORDER BY PlayerSide;";
            $result_mission = mysqli_query($dbh, $sql_mission);
            if (!$result_mission) die("Database access failed: " . mysqli_error($dbh)); 
            $rows_mission = mysqli_num_rows($result_mission); 
            if ($rows_mission)
            {
                $i = 0;
                while ($rows_mission = mysqli_fetch_array($result_mission))
                {
                    $i++;
                    if ($i == 1)
                    {
                        if  ($SideSWORD  == 'CSAT')
                        {
                            $KillsSWORD = $rows_mission['Kills'];
                            $DeathsSWORD = $rows_mission['Deaths'];
                            $BudgetSWORD = $rows_mission['Budget'];
                        }
                        else
                        {
                            $KillsARF = $rows_mission['Kills'];
                            $DeathsARF = $rows_mission['Deaths'];
                            $BudgetARF = $rows_mission['Budget'];
                        }
                    }
                    else
                    {
                        if  ($SideSWORD  == 'CSAT')
                        {
                            $KillsARF = $rows_mission['Kills'];
                            $DeathsARF = $rows_mission['Deaths'];
                            $BudgetARF = $rows_mission['Budget'];
                        }
                        else
                        {
                            $KillsSWORD = $rows_mission['Kills'];
                            $DeathsSWORD = $rows_mission['Deaths'];
                            $BudgetSWORD = $rows_mission['Budget'];
                        }
                    }
                }
            }
        
            $SWORD_Ausruestung = 0;
            $SWORD_Boot = 0;
            $SWORD_Flug = 0;
            $SWORD_Leicht = 0;
            $SWORD_Schwer = 0;
            $SWORD_Stationaer = 0;
            $ARF_Ausruestung = 0;
            $ARF_Boot = 0;
            $ARF_Flug = 0;
            $ARF_Leicht = 0;
            $ARF_Schwer = 0;
            $ARF_Stationaer = 0;

            $sql_kfz = "SELECT Side, Category, COUNT(Category) AS Amount FROM ObjectLifetime WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND (Side = 'NATO' OR SIDE = 'CSAT') GROUP BY Category, Side;";
            $result_kfz = mysqli_query($dbh, $sql_kfz);
            if (!$result_kfz) die("Database access failed: " . mysqli_error($dbh)); 
            $rows_kfz = mysqli_num_rows($result_kfz); 
            if ($rows_kfz)
            {
                while ($rows_kfz = mysqli_fetch_array($result_kfz))
                {
                    $Side = $rows_kfz['Side'];
                    $Category = $rows_kfz['Category'];
                    $Amount = $rows_kfz['Amount'];

                    if ($Side == $SideSWORD)
                    {
                        if ($Category == 'Ausruestung') $SWORD_Ausruestung = $Amount;
                        if ($Category == 'Boot') $SWORD_Boot = $Amount;
                        if ($Category == 'Flug') $SWORD_Flug = $Amount;
                        if ($Category == 'Leicht') $SWORD_Leicht = $Amount;
                        if ($Category == 'Schwer') $SWORD_Schwer = $Amount;
                        if ($Category == 'Stationaer') $SWORD_Stationaer = $Amount;
                    }
                    else
                    {
                        if ($Category == 'Ausruestung') $ARF_Ausruestung = $Amount;
                        if ($Category == 'Boot') $ARF_Boot = $Amount;
                        if ($Category == 'Flug') $ARF_Flug = $Amount;
                        if ($Category == 'Leicht') $ARF_Leicht = $Amount;
                        if ($Category == 'Schwer') $ARF_Schwer = $Amount;
                        if ($Category == 'Stationaer') $ARF_Stationaer = $Amount;
                    }
                }
            }

            $data[] = array(
                "ID" => $MissionID,
                "Schlacht" => $Schlacht,
                "NumPlayers" => $NumPlayers,
                "Weekday" => $Weekday,
                "PointsSWORD" => $PointsSWORD,
                "PointsARF" => $PointsARF,
                "KillsSWORD" => $KillsSWORD,
                "KillsARF" => $KillsARF,
                "DeathsSWORD" => $DeathsSWORD,
                "DeathsARF" => $DeathsARF,
                "BudgetSWORD" => $BudgetSWORD,
                "BudgetARF" => $BudgetARF,
                "SWORD_Ausruestung" => $SWORD_Ausruestung,
                "ARF_Ausruestung" => $ARF_Ausruestung,
                "SWORD_Boot" => $SWORD_Boot,
                "ARF_Boot" => $ARF_Boot,
                "SWORD_Flug" => $SWORD_Flug,
                "ARF_Flug" => $ARF_Flug,
                "SWORD_Leicht" => $SWORD_Leicht,
                "ARF_Leicht" => $ARF_Leicht,
                "SWORD_Schwer" => $SWORD_Schwer,
                "ARF_Schwer" => $ARF_Schwer,
                "SWORD_Stationaer" => $SWORD_Stationaer,
                "ARF_Stationaer" => $ARF_Stationaer
            );
        }
        $result = json_encode($data);
        echo $result;
        
    }
    mysqli_close($dbh);
?>
