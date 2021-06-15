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
                }
            }
            else
            {
                    $Selected_Campaign = $CampaignName;
            }
        }
    }
    else die("No campaigns found.");

    // Schlachten Übersicht
    $sql_missions = "SELECT ID, Start, End, MissionName, MissionFileName, Fractions, SideSWORD, SideARF, PointsSWORD, PointsARF, Rated from Missions WHERE CampaignName = '$Selected_Campaign';";

    $result = mysqli_query($dbh, $sql_missions);

    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
            $data[] = array(
                "ID"=>$row['ID'],
                "Start"=>$row['Start'],
                "End"=>$row['End'],
                "MissionName"=>$row['MissionName'],
                "MissionFileName"=>$row['MissionFileName'],
                "Fractions"=>$row['Fractions'],
                "SideSWORD"=>$row['SideSWORD'],
                "SideARF"=>$row['SideARF'],
                "PointsSWORD"=>$row['PointsSWORD'],
                "PointsARF"=>$row['PointsARF'],
                "Rated"=>$row['Rated']
            );
        }
        echo json_encode($data);
    }
    mysqli_close($dbh);
?>
