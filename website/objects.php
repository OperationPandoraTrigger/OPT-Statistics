<?php
if(isset($_GET['mission'])) $SelectedMissionID = htmlspecialchars($_GET["mission"]); 

if (!empty($SelectedMissionID)) $cachefile = sprintf('cache/objects_mission_%04d.json', $SelectedMissionID);
else $cachefile = 'cache/objects.json';

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

    $sql_stmt = "SELECT Category, Name, Lifetime, Nickname, Side, Price FROM ObjectLifetime INNER JOIN Players ON ObjectLifetime.Buyer = Players.SteamID64 WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND Buyer > 0 ORDER BY Lifetime ASC;";

    $result = mysqli_query($dbh,$sql_stmt);

    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
        $data[] = array(
            'Category' => $row["Category"],
            'Object' => $row["Name"],
            'Lifetime' => $row["Lifetime"],
            'Buyer' => $row["Nickname"],
            'Side' => $row["Side"],
            'Price' => $row["Price"]
        );
        }
        $result = json_encode($data);
        echo $result;
        file_put_contents($cachefile, $result);
    }
    mysqli_close($dbh);
?>
