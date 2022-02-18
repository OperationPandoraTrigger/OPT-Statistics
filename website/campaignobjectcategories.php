<?php
    if (isset($_GET['campaign']) && isset($_GET['side']) && isset($_GET['halftime']))
    {
        $SelectedCampaignID = htmlspecialchars($_GET["campaign"]); 
        $Side = htmlspecialchars($_GET["side"]); 
        $SelectedHalftime = htmlspecialchars($_GET["halftime"]); 
    }
    else die ("Missing parameters."); 

    $db_server = 'localhost';
    $db_name = 'opt';
    $db_user = 'opt';
    $db_passwort = 'optpass';


    if ($SelectedHalftime == '1') $SWORDSide = 'NATO';
    if ($SelectedHalftime == '2') $SWORDSide = 'CSAT';

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

    $cachefile = sprintf('cache/campaignobjectcategories_campaign_%04d_side_%s_halftime_%d.json', $CampaignID, $Side, $SelectedHalftime);

    if (file_exists($cachefile))
    {
        $result = file_get_contents($cachefile);
        echo $result;
        exit(0);
    }


    $sql_start = "SELECT Start FROM Missions WHERE Rated = TRUE AND CampaignName = '$Selected_Campaign' AND SideSWORD = '$SWORDSide' ORDER BY Start LIMIT 1;";

    $result_start = mysqli_query($dbh, $sql_start);
    if (!$result_start) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result_start); 
    if ($rows == 1)
    {
        while ($row = mysqli_fetch_array($result_start))
        {
            $Mission_Start = $row['Start'];
        }
    }
    else die("Wrong number of missions.");


    $sql_end = "SELECT End FROM Missions WHERE Rated = TRUE AND CampaignName = '$Selected_Campaign' AND SideSWORD = '$SWORDSide' ORDER BY End DESC LIMIT 1;";

    $result_end = mysqli_query($dbh, $sql_end);
    if (!$result_end) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result_end); 
    if ($rows == 1)
    {
        while ($row = mysqli_fetch_array($result_end))
        {
            $Mission_End = $row['End'];
        }
    }
    else die("Wrong number of missions.");


    $sql_stmt = "SELECT Category, COUNT(Category) AS Amount, SUM(Price) AS Price, ROUND(SUM(Price)/(SELECT SUM(Price) FROM ObjectLifetime WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND Side = '$Side')*100, 1) AS Percentage FROM ObjectLifetime WHERE Time BETWEEN '$Mission_Start' AND '$Mission_End' AND Side = '$Side' GROUP BY Category;";
    $result = mysqli_query($dbh,$sql_stmt);

    if (!$result) die("Database access failed: " . mysqli_error($dbh)); 

    $rows = mysqli_num_rows($result); 
    if ($rows)
    {
        while ($row = mysqli_fetch_array($result))
        {
            $data[] = array(
                'Category' => $row["Category"],
                'Amount' => $row["Amount"],
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
