<?php
    if (isset($_GET['mission']) && isset($_GET['side']))
    {
        $SelectedMissionID = htmlspecialchars($_GET["mission"]); 
        $SelectedSide = htmlspecialchars($_GET["side"]); 
    }
    else die ("Missing parameters."); 

    $cachefile = sprintf('cache/objectitems_mission_%04d_%s.json', $SelectedMissionID, $SelectedSide);

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

    if (empty($SelectedMissionID)) $sql_missions = "SELECT ID, Start, End, Fractions, SideSWORD, SideARF, MissionFileName, CampaignName, MissionName FROM Missions ORDER BY Start DESC LIMIT 1;";
    else $sql_missions = "SELECT ID, Start, End, Fractions, SideSWORD, SideARF, MissionFileName, CampaignName, MissionName FROM Missions WHERE ID = $SelectedMissionID LIMIT 1;";

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
            $SideSWORD = $row['SideSWORD'];
            $SideARF = $row['SideARF'];
            $Mission_Fractions = $row['Fractions'];
            $Mission_MissionFileName = $row['MissionFileName'];
            $Mission_CampaignName = $row['CampaignName'];
            $Mission_MissionName = $row['MissionName'];
        }
    }
    else die("Wrong number of missions.");

    if ($SelectedSide == "SWORD") $Side = $SideSWORD;
    if ($SelectedSide == "ARF") $Side = $SideARF;

    $sql_stmt = "SELECT Name, COUNT(Name) AS Amount, Category, SUM(Price) AS Price, ROUND(SUM(Price)/(SELECT SUM(Price) FROM ObjectLifetime WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND Side = '$Side')*100, 1) AS Percentage FROM ObjectLifetime WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND Side = '$Side' GROUP BY Name;";
    $result = mysqli_query($dbh, $sql_stmt);

    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 

    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
            $data[] = array(
                'Name' => $row["Name"],
                'Amount' => $row["Amount"],
                'Category' => $row["Category"],
                'Price' => $row["Price"],
                'Percentage' => $row["Percentage"]
            );
        }
        $result = json_encode($data);
        echo $result;
        file_put_contents($cachefile, $result);
    }
    mysqli_close($dbh);
?>
