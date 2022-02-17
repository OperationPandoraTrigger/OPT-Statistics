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

// Cache
$cachefile = sprintf('cache/campaigns_campaign_%04d.json', $CampaignID);

if (file_exists($cachefile))
{
    $result = file_get_contents($cachefile);
    echo $result;
    exit(0);
}

// Kampagnenpunkte
$sql_CampaignPoints = "SELECT SUM(PointsSWORD) AS PointsSWORD, SUM(PointsARF) AS PointsARF from Missions WHERE Rated = True AND CampaignName = '$Selected_Campaign';";

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

// Schlachtpunkte (Gewertet)
$sql_points = "SELECT Start, End, MissionName, MissionFileName, Fractions, PointsSWORD, (@sword := @sword + PointsSWORD) as SumSWORD, PointsARF, (@arf := @arf + PointsARF) as SumARF, Rated from Missions, (SELECT @sword := 0, @arf := 0) tmp WHERE Rated = True AND CampaignName = '$Selected_Campaign' ORDER BY Start ASC;";

$result_points = mysqli_query($dbh, $sql_points);
if (!$result_points) die("Database access failed: " . mysqli_error($dbh)); 

$rows_points = mysqli_num_rows($result_points); 
if ($rows_points)
{
    while ($row = mysqli_fetch_array($result_points))
    {
        $Points_SWORD[] = [strtotime($row['End']) * 1000, $row['PointsSWORD']];
        $Points_SumSWORD[] = [strtotime($row['End']) * 1000, $row['SumSWORD']];
        $Points_ARF[] = [strtotime($row['End']) * 1000, $row['PointsARF']];
        $Points_SumARF[] = [strtotime($row['End']) * 1000, $row['SumARF']];
        $Points_MissionName[] = [strtotime($row['End']) * 1000, 0, $row['MissionName']];
    }
}

// Output
$result = json_encode(array("CampaignData"=>$CampaignData, "CampaignPoints"=>$CampaignPoints, "Points_SWORD"=>$Points_SWORD, "Points_SumSWORD"=>$Points_SumSWORD, "Points_ARF"=>$Points_ARF, "Points_SumARF"=>$Points_SumARF, "Points_MissionName"=>$Points_MissionName));
echo $result;
file_put_contents($cachefile, $result);
mysqli_close($dbh);
?>
