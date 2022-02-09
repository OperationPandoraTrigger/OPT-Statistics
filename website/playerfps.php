<?php
    if (isset($_GET['mission']) && isset($_GET['player']))
    {
        $SelectedMissionID = htmlspecialchars($_GET["mission"]); 
        $PlayerUID = htmlspecialchars($_GET["player"]); 
    }
    else die ("Missing parameters.");

    $cachefile = sprintf('cache/playerfps_mission_%04d_%d.json', $SelectedMissionID, $PlayerUID);

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

    $result = json_encode(array("Info"=>$info, "FPS"=>$FPS));
    echo $result;
    file_put_contents($cachefile, $result);
    mysqli_close($dbh);
?>
