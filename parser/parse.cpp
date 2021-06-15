#include <iostream>
#include <iomanip>
#include <stdarg.h>
#include <boost/algorithm/string.hpp>
#include <boost/filesystem.hpp>
#include <boost/regex.hpp>
#include <mysql++.h>

#define SQL_HOST "127.0.0.1"
#define SQL_PORT 3306
#define SQL_DB "opt"
#define SQL_USER "optwriter"
#define SQL_PASS "xxx"

#define ARCHIVEPATH "log/"

#define DEBUG 0
#define PRINTPARSINERRORS 0
#define MinLogVersion 6

#define MAX_WAIT_TIME 10000

using namespace std;
namespace fs = filesystem;

// needs:
// pacman -S mysql++ boost
// compile:
// c++ -std=c++17 -lboost_filesystem -lboost_regex -lmysqlpp -lmysqlclient -I boost_1_75_0/ -I /usr/include/mysql++/ -I /usr/include/mysql/ parse.cpp -o parse && strip parse

// global vars
string SQL_Mission_Insert = "";
int ParsingError = 0;

// Mission Settings
string CampaignName = "";
string MissionName = "";
int MissionRated = 1;
string SideSWORD = "";
string SideARF = "";

// The DB
map<string, string> db;

// Item lifetimes
map<string, string> ItemNames;
map<string, time_t> ItemBuyTime;
map<string, unsigned long>ItemBuyer;
map<string, string> ItemSide;
map<string, float> ItemPrice;
map<string, time_t> ItemLifeTime;
map<string, time_t> ItemDeathTime;
map<string, string> ItemCategories;

// Players
map<unsigned long, string> PlayerNames;
map<unsigned long, string> PlayerSides;

void PrintError(const char *format, ...)
{
    int BUFFER_SIZE = 10000;
    char buffer[BUFFER_SIZE];
    va_list args;
    va_start(args, format);
    vsnprintf(buffer, BUFFER_SIZE, format, args);
    cerr << buffer;
    va_end(args);
}

void InsertDB(string entry, const char *format, ...)
{
    int BUFFER_SIZE = 10000;

    va_list args;
    va_start(args, format);

    char buffer[BUFFER_SIZE];
    vsnprintf(buffer, BUFFER_SIZE, format, args);
    db[entry] += buffer;

    va_end(args);
}


long int DateToUnixtime(string s)
{
    // fix missing leading zeros for get_time - 2021-3-21 19:38:38
    vector < string > dateArray;
    boost::split(dateArray, s, boost::is_any_of("- :"));
    int elements = dateArray.size();

    if(elements == 6)
    {
        int year = stoi(dateArray[0]);
        int month = stoi(dateArray[1]);
        int day = stoi(dateArray[2]);
        int hour = stoi(dateArray[3]);
        int minute = stoi(dateArray[4]);
        int second = stoi(dateArray[5]);

        char fixedDate[100];
        sprintf(fixedDate, "%.4i-%.2i-%.2i %.2i:%.2i:%.2i", year, month, day, hour, minute, second);
        string fixedDateStr = fixedDate;

        // Normal conversation from now on
        tm t {};
        istringstream ss(fixedDateStr);

        ss >> get_time(&t, "%Y-%m-%d %H:%M:%S");
        if(ss.fail()) PrintError("failed to parse time string!\n");
        time_t time_stamp = mktime(&t);
        if (t.tm_isdst) time_stamp -= 3600; // Sommerzeit? -> 1 Stunde abziehen
        return static_cast < long int >(time_stamp);
    }
    else
    {
        PrintError("failed to parse time string!\n");
        return 0;
    }
}

unsigned long SafeParseUnsignedLong(string str)
{
    if(str.length())
    {
        return stoul(str);
    }
    else
    {
        ParsingError = 1;
        return 0;
    }
}

long SafeParseLong(string str)
{
    if(str.length())
    {
        return stol(str);
    }
    else
    {
        ParsingError = 1;
        return 0;
    }
}

float SafeParseFloat(string str)
{
    if(str.length())
    {
        if(str.find("1e+10") != string::npos) return 0.0;
        return stof(str);
    }
    else
    {
        ParsingError = 1;
        return 0.0;
    }
}

string SafeParseSide(string str)
{
    if(str.length())
    {
        if(str.find("WEST") != string::npos)
            return "NATO";
        else if(str.find("EAST") != string::npos)
            return "CSAT";
        else if(str.find("GUER") != string::npos)
            return "AAF";
        else
            return "UNKNOWN";
    }
    else
    {
        ParsingError = 1;
        return "UNKNOWN";
    }
}


int ParseFPS(string filename, unsigned long starttime, unsigned long endtime)
{
    ifstream fpsstream(filename);
    if(!fpsstream)
    {
        PrintError("FPSfile '%s' not found!\n", filename.c_str());
        exit(1);
    }

    PrintError("Parsing '%s'...\n", filename.c_str());

    int NumSingleFPS = 0;
    int NumAvgFPS = 0;

    map<unsigned long, unsigned long> db_player;
    map<unsigned long, double> db_fps;
    map<unsigned long, int> db_num;

    for(string line; getline(fpsstream, line);)
    {
        // line aufsplitten
        vector < string > lineArray;
        boost::split(lineArray, line, boost::is_any_of("\t"));
        int elements = lineArray.size();

        if(elements == 4)
        {
            unsigned long timecode = DateToUnixtime(lineArray[0]);
            if(timecode < starttime) continue;
            else if(timecode > endtime) break;

            unsigned long PlayerUID = SafeParseUnsignedLong(lineArray[2]);
            float FPS = SafeParseFloat(lineArray[3]);

            db_player[PlayerUID] = PlayerUID;
            db_fps[PlayerUID] += FPS;
            db_num[PlayerUID]++;
            NumSingleFPS++;

            InsertDB("INSERT INTO FPS (Time, PlayerUID, FPS) VALUES", "(FROM_UNIXTIME(%lu), '%lu', '%f'),\n", timecode, PlayerUID, FPS);
        }
    }

    map<unsigned long, unsigned long>::iterator it;
    for(it = db_player.begin(); it != db_player.end(); ++it)
    {
        NumAvgFPS++;
        InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, FPS, PlayerSide) VALUES", "(FROM_UNIXTIME(%lu), '%lu', '%f', '%s'),\n", endtime, it->first, db_fps[it->second] / db_num[it->second], PlayerSides[it->first].c_str());
    }
    
    PrintError("Fetched %i single FPS events for %i players.\n", NumSingleFPS, NumAvgFPS);
    if (NumSingleFPS < 100 || NumAvgFPS < 3)
    {
        PrintError("Too few FPS events. Exiting...\n");
        exit(1);
    }
    else
    {
        return 0;
    }
}


int ParseLog(string logfile, string fpsfile)
{
    ifstream logstream(logfile);
    if(!logstream)
    {
        PrintError("Logfile '%s' not found!\n", logfile.c_str());
        exit(1);
    }

    PrintError("Parsing '%s'...\n", logfile.c_str());

    long int loadtime = 0;
    long int loadtime_real = 0;
    long int timecode = 0;
    long int Time = 0;
    long int MissionStart = 0;
    long int MissionEnd = 0;
    string MissionFilename = "";
    unsigned long LogVersion = 0;
    string Fractions = "";
    unsigned long PointsNATO = 0;
    unsigned long PointsCSAT = 0;
    unsigned long PointsAAF = 0;
    unsigned long PointsSWORD = 0;
    unsigned long PointsARF = 0;

    int NumKills = 0;

    for(string line; getline(logstream, line);)
    {
        if(DEBUG > 2) PrintError("%i\n", line.length());

        // line aufsplitten
        vector < string > lineArray;

        boost::split(lineArray, line, boost::is_any_of("\t"));
        int elements = lineArray.size();

        // abbrechen wenn zuwenig elemente oder kein OPT_LOG prefix
        if(elements < 4 || (lineArray[0].find("[OPT_LOG]") == string::npos))
            continue;

        if(DEBUG > 1)
        {
            PrintError("elements: %i -- ", elements);
            for(unsigned int x = 0; x < elements; x++)
            {
                PrintError("%i = %s (%i) // ", x, lineArray[x].c_str(), lineArray[x].length());
            }
            PrintError("\n");
        }

        ParsingError = 0;

        timecode = SafeParseFloat(lineArray[1]);

        if(ParsingError)
        {
            if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
            continue;
        }

        if(lineArray[2].find("Logging") != string::npos && lineArray[3].find("Start") != string::npos)
        {
            if(elements != 7)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

/*
            if (LogVersion)
            {
                PrintError("Multiple missions detected in this logfile. Aborting...\n");
                exit(1);
            }
*/
            loadtime_real = DateToUnixtime(lineArray[6]);
            loadtime = timecode;
            Time = loadtime_real;

            LogVersion = SafeParseUnsignedLong(lineArray[4]);
            Fractions = lineArray[5];

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            PrintError("Mission started. LogVer: %i - Fractions: %s\n", LogVersion, Fractions.c_str());
            continue;
        }

        if(LogVersion >= MinLogVersion && lineArray[2].find("Player") != string::npos && lineArray[3].find("Joined") != string::npos)
        {
            if(elements != 7)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }
            Time = timecode - loadtime + loadtime_real;

            unsigned long PlayerUID = SafeParseUnsignedLong(lineArray[4]);
            string PlayerName = lineArray[5];
            string PlayerSide = SafeParseSide(lineArray[6]);

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            if(DEBUG) PrintError("%li - Player joined: %lu - %s (%s) - Time: %li\n", timecode, PlayerUID, PlayerName.c_str(), PlayerSide.c_str(), Time);

            PlayerNames[PlayerUID] = PlayerName;
            PlayerSides[PlayerUID] = PlayerSide;
            continue;
        }


        if(LogVersion >= MinLogVersion && lineArray[2].find("Mission") != string::npos && lineArray[3].find("Truce") != string::npos)
        {
            if(elements != 8)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            if (MissionEnd)
            {
                PrintError("Multiple missions detected in this logfile. Aborting...\n");
                exit(1);
            }

            Time = timecode - loadtime + loadtime_real;
            MissionStart = Time;

            MissionFilename = lineArray[7];

            if(DEBUG) PrintError("Mission start @ %li // File: %s\n\n", MissionStart, MissionFilename.c_str());
            continue;
        }


        if(MissionStart && lineArray[2].find("Budget") != string::npos)
        {
            if(elements != 14)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }
            Time = timecode - loadtime + loadtime_real;

            float BudgetNATO = SafeParseFloat(lineArray[4]);
            float BudgetCSAT = SafeParseFloat(lineArray[5]);
            float BudgetAAF = SafeParseFloat(lineArray[6]);

            long PlayerUID = SafeParseLong(lineArray[7]);
            string PlayerName = lineArray[8];

            string ItemNetID = lineArray[10];
            string ItemName = lineArray[11];
            string ItemCategory = lineArray[12];

            float Price = SafeParseFloat(lineArray[13]);

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            float BudgetSWORD;
            if (SideSWORD.find("NATO") != string::npos) BudgetSWORD = BudgetNATO;
            else if (SideSWORD.find("CSAT") != string::npos) BudgetSWORD = BudgetCSAT;
            else if (SideSWORD.find("AAF") != string::npos) BudgetSWORD = BudgetAAF;

            float BudgetARF;
            if (SideARF.find("NATO") != string::npos) BudgetARF = BudgetNATO;
            else if (SideARF.find("CSAT") != string::npos) BudgetARF = BudgetCSAT;
            else if (SideARF.find("AAF") != string::npos) BudgetARF = BudgetAAF;

            if(lineArray[3].find("Buy") != string::npos)
            {
                ItemNames[ItemNetID] = ItemName;
                ItemBuyTime[ItemNetID] = Time;
                ItemBuyer[ItemNetID] = PlayerUID;
                ItemSide[ItemNetID] = PlayerSides[PlayerUID];
                ItemPrice[ItemNetID] = Price;
                ItemLifeTime[ItemNetID] = 0;
                ItemCategories[ItemNetID] = ItemCategory;
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, BudgetItem, BudgetBuy, BudgetSWORD, BudgetARF) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%s', '%.2f', '%.2f', '%.2f'),\n", Time, PlayerUID, PlayerSides[PlayerUID].c_str(), ItemName.c_str(), Price, BudgetSWORD, BudgetARF);
            }

            else if(lineArray[3].find("Sell") != string::npos)
            {
                ItemLifeTime[ItemNetID] = Time - ItemBuyTime[ItemNetID];
                ItemDeathTime[ItemNetID] = Time;
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, BudgetItem, BudgetSell, BudgetSWORD, BudgetARF) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%s', '%.2f', '%.2f', '%.2f'),\n", Time, PlayerUID, PlayerSides[PlayerUID].c_str(), ItemName.c_str(), Price, BudgetSWORD, BudgetARF);
            }

            else
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            continue;
        }




        if(MissionStart && lineArray[2].find("Vehicle") != string::npos)
        {
            if(elements < 8)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }
            Time = timecode - loadtime + loadtime_real;

            string ItemNetID = lineArray[7];
            string ItemName = lineArray[4];
            string ItemCategory = lineArray[5];
//            ItemCategories[ItemNetID] = ItemCategory;
            ItemDeathTime[ItemNetID] = Time;

            if(lineArray[3].find("DestroyByAccident") != string::npos)
            {
                if(elements != 8)
                {
                    PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                    continue;
                }

                ItemNames[ItemNetID] = ItemName;
                ItemLifeTime[ItemNetID] = Time - ItemBuyTime[ItemNetID];
                continue;
            }

            else if(lineArray[3].find("DestroyByMan") != string::npos)
            {
                if(elements != 13)
                {
                    PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                    continue;
                }

                ItemNames[ItemNetID] = ItemName;
                ItemLifeTime[ItemNetID] = Time - ItemBuyTime[ItemNetID];
                unsigned long Killer = SafeParseUnsignedLong(lineArray[8]);
                float Distance = SafeParseFloat(lineArray[11]);
                string Item = lineArray[12];
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KillDistance, KillItem, KilledVehicleName, KilledVehicleCategory) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%s', '%s', '%s'),\n", Time, Killer, PlayerSides[Killer].c_str(), Distance, Item.c_str(), ItemName.c_str(), ItemCategory.c_str());
                continue;
            }
            else if(lineArray[3].find("DestroyByCrew") != string::npos)
            {

                if(elements < 13)
                {
                    PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                    continue;
                }

                ItemNames[ItemNetID] = ItemName;
                ItemLifeTime[ItemNetID] = Time - ItemBuyTime[ItemNetID];
                string Item = lineArray[8];
                float Distance = SafeParseFloat(lineArray[10]);

                if(elements >= 13)
                {
                    unsigned long Killer = SafeParseUnsignedLong(lineArray[11]);
                    InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KillDistance, KillItem, KilledVehicleName, KilledVehicleCategory) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%s', '%s', '%s'),\n", Time, Killer, PlayerSides[Killer].c_str(), Distance, Item.c_str(), ItemName.c_str(), ItemCategory.c_str());
                }

                // logge auch kills für die restlichen crewslots
                if(elements >= 15)
                {
                    unsigned long Killer = SafeParseUnsignedLong(lineArray[13]);
                    InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KillDistance, KillItem, KilledVehicleName, KilledVehicleCategory) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%s', '%s', '%s'),\n", Time, Killer, PlayerSides[Killer].c_str(), Distance, Item.c_str(), ItemName.c_str(), ItemCategory.c_str());
                }

                if(elements >= 17)
                {
                    unsigned long Killer = SafeParseUnsignedLong(lineArray[15]);
                    InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KillDistance, KillItem, KilledVehicleName, KilledVehicleCategory) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%s', '%s', '%s'),\n", Time, Killer, PlayerSides[Killer].c_str(), Distance, Item.c_str(), ItemName.c_str(), ItemCategory.c_str());
                }

                if(elements >= 19)
                {
                    unsigned long Killer = SafeParseUnsignedLong(lineArray[17]);
                    InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KillDistance, KillItem, KilledVehicleName, KilledVehicleCategory) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%s', '%s', '%s'),\n", Time, Killer, PlayerSides[Killer].c_str(), Distance, Item.c_str(), ItemName.c_str(), ItemCategory.c_str());
                }

                continue;
            }

            else
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            continue;
        }


        if(MissionStart && lineArray[2].find("Mission") != string::npos && lineArray[3].find("State") != string::npos)
        {
            if(elements != 8)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;

            PointsNATO = SafeParseUnsignedLong(lineArray[4]);
            PointsCSAT = SafeParseUnsignedLong(lineArray[5]);
            PointsAAF = SafeParseUnsignedLong(lineArray[6]);

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            if (SideSWORD.find("NATO") != string::npos) PointsSWORD = PointsNATO;
            else if (SideSWORD.find("CSAT") != string::npos) PointsSWORD = PointsCSAT;
            else if (SideSWORD.find("AAF") != string::npos) PointsSWORD = PointsAAF;

            if (SideARF.find("NATO") != string::npos) PointsARF = PointsNATO;
            else if (SideARF.find("CSAT") != string::npos) PointsARF = PointsCSAT;
            else if (SideARF.find("AAF") != string::npos) PointsARF = PointsAAF;

            InsertDB("INSERT IGNORE INTO Events (Time, PointsSWORD, PointsARF) VALUES", "(FROM_UNIXTIME(%li), '%i', '%i'),\n", Time, PointsSWORD, PointsARF);
            continue;
        }


        if(MissionStart && lineArray[2].find("Transport") != string::npos && lineArray[3].find("Fly") != string::npos)
        {
            if(elements != 11)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;

            unsigned long PassengerUID = SafeParseUnsignedLong(lineArray[4]);
            string PassengerName = lineArray[5];
            unsigned long TransporterUID = SafeParseUnsignedLong(lineArray[7]);
            string TransporterName = lineArray[8];
            float Distance = SafeParseFloat(lineArray[10]);

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            if(DEBUG) PrintError("%li - Transported (Air): %s by %s (dist: %.1f) @ %li\n", timecode, PassengerName.c_str(), TransporterName.c_str(), Distance, Time);

            InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, PilotDistance, PassengerUID) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%lu'),\n", Time, TransporterUID, PlayerSides[TransporterUID].c_str(), Distance, PassengerUID);
            InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, AirPassengerDistance, TransporterUID) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%lu'),\n", Time, PassengerUID, PlayerSides[PassengerUID].c_str(), Distance, TransporterUID);
            continue;
        }


        if(MissionStart && lineArray[2].find("Transport") != string::npos && lineArray[3].find("Drive") != string::npos)
        {
            if(elements != 11)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;

            unsigned long PassengerUID = SafeParseUnsignedLong(lineArray[4]);
            string PassengerName = lineArray[5];
            unsigned long TransporterUID = SafeParseUnsignedLong(lineArray[7]);
            string TransporterName = lineArray[8];
            float Distance = SafeParseFloat(lineArray[10]);

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            if(DEBUG) PrintError("%li - Transported (Drive): %s by %s (dist: %.1f) @ %li\n", timecode, PassengerName.c_str(), TransporterName.c_str(), Distance, Time);

            InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, DriverDistance, PassengerUID) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%lu'),\n", Time, TransporterUID, PlayerSides[TransporterUID].c_str(), Distance, PassengerUID);
            InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, DrivePassengerDistance, TransporterUID) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f', '%lu'),\n", Time, PassengerUID, PlayerSides[PassengerUID].c_str(), Distance, TransporterUID);
            continue;
        }


        if(MissionStart && lineArray[2].find("Flag") != string::npos && lineArray[3].find("Conquer") != string::npos)
        {
            if(elements != 9)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;

            unsigned long PlayerUID = SafeParseUnsignedLong(lineArray[5]);
            float Distance = SafeParseFloat(lineArray[8]);

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, FlagDistance) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%.3f'),\n", Time, PlayerUID, PlayerSides[PlayerUID].c_str(), Distance);
            continue;
        }


        if(MissionStart && lineArray[2].find("Health") != string::npos && lineArray[3].find("Kill") != string::npos)
        {
            if(elements != 12)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;

            unsigned long VictimUID = SafeParseUnsignedLong(lineArray[4]);
            string VictimName = lineArray[5];
            string VictimSide = PlayerSides[VictimUID];
            unsigned long CauserUID = SafeParseUnsignedLong(lineArray[7]);
            string CauserName = lineArray[8];
            string CauserSide = PlayerSides[CauserUID];
            float Distance = SafeParseFloat(lineArray[10]);
            string Item = lineArray[11];

            if(ParsingError)
            {
                if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                continue;
            }

            if(DEBUG)
                PrintError("%li - Killed: %s by %s with %s (dist: %.1f) @ %li\n", timecode, VictimName.c_str(), CauserName.c_str(), Item.c_str(), Distance, Time);


            if(CauserSide == VictimSide)
            {
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KilledTeammate, KillDistance, KillItem) VALUES", "(FROM_UNIXTIME(%lu), '%lu', '%s', '%lu', '%.3f', '%s'),\n", Time, CauserUID, CauserSide.c_str(), VictimUID, Distance, Item.c_str());
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KilledByTeammate, KilledByDistance, KillItem) VALUES", "(FROM_UNIXTIME(%lu), '%lu', '%s', '%lu', '%.3f', '%s'),\n", Time, VictimUID, VictimSide.c_str(), CauserUID, Distance, Item.c_str());
            }
            else
            {
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KilledEnemy, KillDistance, KillItem) VALUES", "(FROM_UNIXTIME(%lu), '%lu', '%s', '%lu', '%.3f', '%s'),\n", Time, CauserUID, CauserSide.c_str(), VictimUID, Distance, Item.c_str());
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, KilledByEnemy, KilledByDistance, KillItem) VALUES", "(FROM_UNIXTIME(%lu), '%lu', '%s', '%lu', '%.3f', '%s'),\n", Time, VictimUID, VictimSide.c_str(), CauserUID, Distance, Item.c_str());
            }

            NumKills++;
            continue;
        }


        if(MissionStart && lineArray[2].find("Health") != string::npos && lineArray[3].find("Revive") != string::npos)
        {
            if(elements != 11)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;

            unsigned long VictimUID = SafeParseUnsignedLong(lineArray[4]);
            string VictimName = lineArray[5];
            string VictimSide = PlayerSides[VictimUID];
            unsigned long CauserUID = SafeParseUnsignedLong(lineArray[7]);

            if(CauserUID > 0)
            {
                string CauserName = lineArray[8];
                string CauserSide = PlayerSides[CauserUID];
                float Distance = SafeParseFloat(lineArray[10]);

                if(ParsingError)
                {
                    if(PRINTPARSINERRORS) PrintError("ParsingError in line: %s\n", line.c_str());
                    continue;
                }

                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, RevivedTeammate, RevivedDistance) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%lu', '%.3f'),\n", Time, CauserUID, CauserSide.c_str(), VictimUID, Distance);
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, RevivedByTeammate, RevivedByDistance) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', '%lu', '%.3f'),\n", Time, VictimUID, VictimSide.c_str(), CauserUID, Distance);
            }
            continue;
        }




        if(MissionStart && lineArray[2].find("Health") != string::npos && lineArray[3].find("Respawn") != string::npos)
        {
            if(elements != 8)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;

            unsigned long VictimUID = SafeParseUnsignedLong(lineArray[4]);
            string VictimName = lineArray[5];
            string VictimSide = PlayerSides[VictimUID];
            string RespawnReason = lineArray[7];

            if(RespawnReason.find("RespawnClick") != string::npos)
            {
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, RespawnClick) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', 1),\n", Time, VictimUID, VictimSide.c_str());
            }
            else if(RespawnReason.find("RespawnTimeout") != string::npos)
            {
                InsertDB("INSERT IGNORE INTO Events (Time, PlayerUID, PlayerSide, RespawnTimeout) VALUES", "(FROM_UNIXTIME(%li), '%lu', '%s', 1),\n", Time, VictimUID, VictimSide.c_str());
            }
            continue;
        }


        if(MissionStart && lineArray[2].find("Mission") != string::npos && lineArray[3].find("End") != string::npos)
        {
            if(elements != 8)
            {
                PrintError("Parameteranzahl: %i @ %s\n", elements, line.c_str());
                continue;
            }

            Time = timecode - loadtime + loadtime_real;
            MissionEnd = Time;
            PointsNATO = SafeParseUnsignedLong(lineArray[4]);
            PointsCSAT = SafeParseUnsignedLong(lineArray[5]);
            PointsAAF = SafeParseUnsignedLong(lineArray[6]);

            if (SideSWORD.find("NATO") != string::npos) PointsSWORD = PointsNATO;
            else if (SideSWORD.find("CSAT") != string::npos) PointsSWORD = PointsCSAT;
            else if (SideSWORD.find("AAF") != string::npos) PointsSWORD = PointsAAF;

            if (SideARF.find("NATO") != string::npos) PointsARF = PointsNATO;
            else if (SideARF.find("CSAT") != string::npos) PointsARF = PointsCSAT;
            else if (SideARF.find("AAF") != string::npos) PointsARF = PointsAAF;

            PrintError("Mission finished. SWORD: %lu // ARF:%lu\n", PointsSWORD, PointsARF);
            break;
        }
    }

    if(LogVersion < MinLogVersion)
    {
        PrintError("Unsupported LOG-Version: %lu < %lu.\n", LogVersion, MinLogVersion);
        exit(1);
    }
    else
    {
        if(MissionEnd == 0)
        {
            PrintError("WARNING: No mission-end detected. Using last timestamp that occured.");
            MissionEnd = Time;
        }

        // Object lifetimes
        map<string, time_t>::iterator ii;
        for(ii = ItemLifeTime.begin(); ii != ItemLifeTime.end(); ++ii)
        {
            if(ii->second == 0)
            {
                ii->second = MissionEnd - MissionStart;
                ItemDeathTime[ii->first] = MissionEnd;
            }
            InsertDB("INSERT IGNORE INTO ObjectLifetime (Time, Category, Name, Lifetime, Buyer, Side, Price) VALUES", "(FROM_UNIXTIME(%li), '%s', '%s', '%i', '%lu', '%s', '%.2f'),\n", ItemDeathTime[ii->first], ItemCategories[ii->first].c_str(), ItemNames[ii->first].c_str(), ItemLifeTime[ii->first], ItemBuyer[ii->first], ItemSide[ii->first].c_str(), ItemPrice[ii->first]);
        }


        // Update Playerlist for Server (UID=0)
        InsertDB("INSERT INTO Players (SteamID64, Nickname, SeenFirst, SeenLast) VALUES", "('0', 'Server', FROM_UNIXTIME(%li), FROM_UNIXTIME(%li)),\n", MissionStart, MissionEnd);


        // Update Playerlist for Players (UID > 0)
        map<unsigned long, string>::iterator pi;
        for(pi = PlayerNames.begin(); pi != PlayerNames.end(); ++pi)
        {
            InsertDB("INSERT INTO Players (SteamID64, Nickname, SeenFirst, SeenLast) VALUES", "('%lu', '%s', FROM_UNIXTIME(%li), FROM_UNIXTIME(%li)),\n", pi->first, pi->second.c_str(), MissionStart, MissionEnd);
        }

        // Letztes Komma vom letzten Eintrag wieder entfernen
        map<string, string>::iterator tmpit;
        tmpit = db.end();
        tmpit--;
        tmpit->second[tmpit->second.length() - 2] = ' ';
        InsertDB("INSERT INTO Players (SteamID64, Nickname, SeenFirst, SeenLast) VALUES", "ON DUPLICATE KEY UPDATE Nickname=VALUES(Nickname), SeenFirst=LEAST(SeenFirst, VALUES(SeenFirst)), SeenLast=GREATEST(SeenLast, VALUES(SeenLast));\n", MissionStart, MissionEnd);

        // Performance parse
        ParseFPS(fpsfile, MissionStart, MissionEnd);

        // Ausgabe aller DB Einträge sortiert nach Art
        map<string, string>::iterator it;
        for(it = db.begin(); it != db.end(); ++it)
        {
            it->second[it->second.length() - 2] = ';';  // letztes komma durch semikolon ersetzen
        }

        // Missionseintrag ganz zum Schluss schreiben
        char buf[1000];
        sprintf(buf, "INSERT IGNORE INTO Missions (Start, End, Fractions, SideSWORD, SideARF, MissionFileName, CampaignName, MissionName, Rated, PointsSWORD, PointsARF) VALUES (FROM_UNIXTIME(%li), FROM_UNIXTIME(%li), '%s', '%s', '%s', '%s', '%s', '%s', %i, '%lu', '%lu');\n", MissionStart, MissionEnd, Fractions.c_str(), SideSWORD.c_str(), SideARF.c_str(), MissionFilename.c_str(), CampaignName.c_str(), MissionName.c_str(), MissionRated, PointsSWORD, PointsARF);
        SQL_Mission_Insert = buf;

        if (NumKills > 10)
        {
            PrintError("Parsing ready. %i kills occured.\n", NumKills);
        }
        else
        {
            PrintError("Parsing ready. %i kills occured - Not very much! - Did something went wrong? Aborting...\n", NumKills);
            exit(1);
        }
    }
    return 0;
}


time_t GetFileTime(const string& path)
{
    time_t t = boost::filesystem::last_write_time(path);
    return t;
}

string GetFileTimeString(const string& path)
{
    time_t t = boost::filesystem::last_write_time(path);
    return asctime(localtime(&t));
}

string FindNewestFile(string regex)
{
    const string target_path(".");
    //const boost::regex my_filter("arma3server_.*\\.log");
    const boost::regex my_filter(regex);

    string NewestFileName = "";
    time_t NewestFileTime = 0;

    boost::filesystem::directory_iterator end_itr; // Default ctor yields past-the-end
    for(boost::filesystem::directory_iterator i(target_path); i != end_itr; ++i)
    {
        // Skip if not a file
        if(!boost::filesystem::is_regular_file(i->status())) continue;

        boost::smatch what;

        // File doesnt match
        if(!boost::regex_match(i->path().filename().string(), what, my_filter)) continue;

        // File matches, store it
        string FileName = i->path().filename().string();
        time_t FileTime = GetFileTime(FileName);

        // Save the newest file
        if (FileTime > NewestFileTime)
        {
            NewestFileTime = FileTime;
            NewestFileName = FileName;
        }
    }

    return NewestFileName;
}

int WaitForCompleteLogFile(string FileName)
{
    ifstream logstream(FileName);
    if(!logstream)
    {
        PrintError("File '%s' not found!\n", FileName.c_str());
        exit(1);
    }

    int filepos = 0;
    int filesize = 0;
    int waitcounter = 0;
    
    while(1)
    {
        PrintError("\rWaiting for 'Mission End' in %s... (Readposition: %i / Filesize: %i) (Waiting %i / %i secs)", FileName.c_str(), filepos, filesize, waitcounter, MAX_WAIT_TIME);

        logstream.seekg(0, logstream.end);
        filesize = logstream.tellg();
        logstream.seekg(filepos);

        // nur bis 100 bytes ans ende heranlesen damit die zeile für die erkennung nicht getrennt wird
        for(string line; getline(logstream, line) && (filepos + 100) < filesize;)
        {
            filepos = logstream.tellg();
            if(line.find("Mission\tEnd") != string::npos)
            {
                PrintError("\n'Mission End' was found in %s! (Readposition: %i / Filesize: %i)\n", FileName.c_str(), filepos, filesize);
                return 0;
            }
        }
        sleep(1);
        if (waitcounter++ > MAX_WAIT_TIME)
        {
            PrintError("\nMaximum waittime of %i seconds exceeded!\n", MAX_WAIT_TIME);
            exit(1);
        }
        logstream.clear();  // clear EOF bits usw. damit man wieder lesen kann wenn das file gewachsen ist
    }
}

int SendToDatabase(void)
{
    PrintError("Sending Data to the database...\n");
    try
    {
        mysqlpp::Connection sql(false);
        if (sql.connect(SQL_DB, SQL_HOST, SQL_USER, SQL_PASS, SQL_PORT))
        {
		    mysqlpp::Query query = sql.query();

            // Ausgabe aller DB Einträge sortiert nach Art
            map<string, string>::iterator it;
            for(it = db.begin(); it != db.end(); ++it)
            {
                it->second[it->second.length() - 2] = ';';  // letztes komma durch semikolon ersetzen
                query.execute(it->first + '\n' + it->second);
            }

            // Ausgabe des Missions-Eintrags ganz zum Schluss
            query.execute(SQL_Mission_Insert);
            return 0;
        }
        else
        {
            cerr << "DB connection failed: " << sql.error() << endl;
            return 1;
        }
    }

   	catch (const mysqlpp::BadQuery& er)
    {
		// Handle any query errors
		cerr << "Query error: " << er.what() << endl;
		return -1;
	}
	
    catch (const mysqlpp::BadConversion& er)
    {	
		// Handle bad conversions
		cerr << "Conversion error: " << er.what() << endl <<
				"\tretrieved data size: " << er.retrieved <<
				", actual size: " << er.actual_size << endl;
		return -1;
	}

	catch (const mysqlpp::Exception& er)
    {
		// Catch-all for any other MySQL++ exceptions
		cerr << "Error: " << er.what() << endl;
		return -1;
	}
}

void ArchiveLogFile(string FileName, string DestinationDirectory)
{
    if(access((DestinationDirectory + FileName).c_str(), F_OK) == 0)
    {
        PrintError("Archiving of '%s' skipped due to existence...\n", FileName.c_str());
    }
    else
    {
        PrintError("Archiving '%s' to '%s'...\n", FileName.c_str(), DestinationDirectory.c_str());
        ifstream src(FileName, ios::binary);
        if(!src)
        {
            PrintError("'%s' not found! Aborting...\n", FileName.c_str());
            exit(1);
        }
        ofstream dst(DestinationDirectory + FileName, ios::binary);
        dst << src.rdbuf();
    }
}

int main(int argc, char **argv)
{
    string LogFileName = "";
    string FPSFileName = "";

    if(argc == 5)
    {
        CampaignName = argv[1];
        MissionName = argv[2];
        SideSWORD = argv[3];
        SideARF = argv[4];
        LogFileName = FindNewestFile("arma3server_20[0-9]{2}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}.log");
        FPSFileName = FindNewestFile("20[0-9]{2}-[0-9]{2}-[0-9]{2}_[0-9]{2}_[0-9]{2}_[0-9]{2}.log");
        PrintError("Automatically using newest files '%s' and '%s'\n", LogFileName.c_str(), FPSFileName.c_str());
    }

    else if(argc == 7)
    {
        CampaignName = argv[1];
        MissionName = argv[2];
        SideSWORD = argv[3];
        SideARF = argv[4];
        LogFileName = argv[5];
        FPSFileName = argv[6];
        PrintError("Using files '%s' and '%s'\n", LogFileName.c_str(), FPSFileName.c_str());
    }

    else
    {
        PrintError("Usage examples:\n");
        PrintError("===============\n");
        PrintError("> %s CampaignName MissionName SideSWORD SideARF\n", argv[0]);
        PrintError("> %s CampaignName MissionName SideSWORD SideARF logfile fpsfile\n", argv[0]);
        PrintError("\n");
        exit(1);
    }

    WaitForCompleteLogFile(LogFileName);
    ArchiveLogFile(LogFileName, ARCHIVEPATH);
    ArchiveLogFile(FPSFileName, ARCHIVEPATH);
    ParseLog(ARCHIVEPATH + LogFileName, ARCHIVEPATH + FPSFileName);
    SendToDatabase();
    PrintError("Done.\n");
}
