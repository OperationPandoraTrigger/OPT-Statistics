**OPT-Statistics**\
https://stats.opt4.net:2021
\
\
**orden**\
Rendert für jeden Spieler ein PNG mit entsprechendem Dienstgrad und Orden.\
Zur Einbindung in die Statistik-Webseite und/oder in die Forensignatur.\
Benötigt *imagemagick*, *ghostscript* und *gsfonts*. Vermutlich auch *librsvg*, *libxft* und *freetype2*.\
Ausführen mit:\
`./orden.sh`\
\
**parser**\
Parst die ArmA-Logfiles und schreibt die einzelnen Events in eine MariaDB Datenbank.\
Benötigt *mysql++*, *boost* und *curl*.\
Kompilieren mit:\
`c++ -std=c++17 -lboost_filesystem -lboost_regex -lmysqlpp -lmysqlclient -lcurl -I /usr/include/mysql++/ -I /usr/include/mysql/ parse.cpp -o parse && strip parse`\
\
**website**\
Zeigt die Events aus der MariaDB Datenbank grafisch und als Statistiken an.\
Benötigt *php*, *tabulator* und *flot*.
