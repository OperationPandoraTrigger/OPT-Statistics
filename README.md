**OPT-Statistics**
https://stats.opt4.net:2021

**parser**
Parst die ArmA-Logfiles und schreibt die einzelnen Events in eine MariaDB Datenbank.
Benötigt *mysql++* und *boost*.
Kompilieren mit:
`c++ -std=c++17 -lboost_filesystem -lboost_regex -lmysqlpp -lmysqlclient -I boost_1_75_0/ -I /usr/include/mysql++/ -I /usr/include/mysql/ parse.cpp -o parse && strip parse`

**website**
Zeigt die Events aus der MariaDB Datenbank grafisch und als Statistiken an.
Benötigt *php*, *tabulator* und *flot*.
