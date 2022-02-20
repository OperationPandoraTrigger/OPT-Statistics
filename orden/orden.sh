#!/bin/bash

##########################
DB_NAME=opt
DB_USER=opt
DB_PASS=optpass

TEMPDIR=/tmp
ORDENDIR=/root/log/orden
WWWDIR=/var/www/orden
##########################

# Get most kills
mariadb -u ${DB_USER} -p${DB_PASS} ${DB_NAME} --skip-column-names --silent --execute="SELECT PlayerUID, COUNT(KilledEnemy) AS Kills FROM Events WHERE PlayerUID != 0 GROUP BY PlayerUID ORDER BY Kills DESC LIMIT 1;" > ${TEMPDIR}/mostkills.tmp
while IFS=$'\t' read -r -a mostkills
do
    MOSTKILLS=${mostkills[0]}
done < ${TEMPDIR}/mostkills.tmp
rm ${TEMPDIR}/mostkills.tmp

# Get most deaths
mariadb -u ${DB_USER} -p${DB_PASS} ${DB_NAME} --skip-column-names --silent --execute="SELECT PlayerUID, COUNT(KilledByEnemy) AS Deaths FROM Events WHERE PlayerUID != 0 GROUP BY PlayerUID ORDER BY Deaths DESC LIMIT 1;" > ${TEMPDIR}/mostdeaths.tmp
while IFS=$'\t' read -r -a mostdeaths
do
    MOSTDEATHS=${mostdeaths[0]}
done < ${TEMPDIR}/mostdeaths.tmp
rm ${TEMPDIR}/mostdeaths.tmp


# Scriptaufruf mit Steam64-ID: Nur für diesen Spieler rendern
# Scriptaufruf mit --all: Für alle Spieler rendern
# Scriptaufruf ohne Parameter: Nur Spieler rendern, die in den letzten 9 Tagen aktiv waren
RegularExpressionNumber='^[0-9]+$'
if [[ "${1}" =~ $RegularExpressionNumber ]] ; then
    SQL="SELECT SteamID64, Nickname, DATE_FORMAT(SeenFirst, '%d.%m.%Y') AS SeenFirst FROM Players WHERE SteamID64 = ${1};"
else
    if [[ "$*" == *"--all"* ]]; then
	SQL="SELECT SteamID64, Nickname, DATE_FORMAT(SeenFirst, '%d.%m.%Y') AS SeenFirst FROM Players WHERE SteamID64 != 0;"
    else
	SQL="SELECT SteamID64, Nickname, DATE_FORMAT(SeenFirst, '%d.%m.%Y') AS SeenFirst FROM Players WHERE SteamID64 != 0 AND SeenLast > SUBDATE(NOW(), 9);"
    fi
fi

mariadb -u ${DB_USER} -p${DB_PASS} ${DB_NAME} --skip-column-names --silent --execute="${SQL}" > ${TEMPDIR}/players.tmp
PLAYERS=`wc -l ${TEMPDIR}/players.tmp | cut -d " " -f 1`
PLAYER=0
while IFS=$'\t' read -r -a players
do
    PLAYER=$((PLAYER+1))
    STEAM64=${players[0]}
    NICK=${players[1]}
    SINCE=${players[2]}

    # Get stats
    mariadb -u ${DB_USER} -p${DB_PASS} ${DB_NAME} --skip-column-names --silent --execute="WITH Contributions AS (SELECT PlayerUID, MissionID FROM Events GROUP BY PlayerUID, MissionID ) SELECT E.PlayerUID, P.Nickname AS Name, E.PlayerSide, IF(E.PlayerUID, COUNT(E.KilledEnemy), 0) AS Kills, IF(E.PlayerUID, COUNT(E.KilledTeammate), 0) AS Teamkills, IF(E.PlayerUID, COUNT(E.KilledByEnemy), 0) AS DeathsByEnemy, IF(E.PlayerUID, COUNT(E.KilledByTeammate), 0) AS DeathsByTeammate, IF(E.PlayerUID, COUNT(E.FlagDistance), 0) AS FlagConquers, IF(E.PlayerUID, COUNT(E.KilledVehicleName), 0) AS Vehiclekills, IF(E.PlayerUID, COUNT(E.RevivedTeammate), 0) AS Revives, IF(E.PlayerUID, (COUNT(E.RespawnClick) + COUNT(RespawnTimeout)), 0) AS Respawns, IF(E.PlayerUID, (IFNULL(SUM(E.BudgetBuy), 0) - IFNULL(SUM(BudgetSell), 0)), 0) AS Cost, IF(E.PlayerUID, ROUND(MAX(E.KillDistance)), 0) AS MaxKillDistance, ROUND(AVG(E.FPS), 1) AS FPS, ROUND(IFNULL(SUM(E.PilotDistance), 0) / 1000, 0) AS PilotDistance, ROUND(IFNULL(SUM(E.AirPassengerDistance), 0) / 1000, 0) AS AirPassengerDistance, ROUND(IFNULL(SUM(E.DriverDistance), 0) / 1000, 0) AS DriverDistance, ROUND(IFNULL(SUM(E.DrivePassengerDistance), 0) / 1000, 0) AS DrivePassengerDistance, ROUND((IFNULL(SUM(E.PilotDistance), 0) + IFNULL(SUM(E.DriverDistance), 0) + IFNULL(SUM(E.BoatDistance), 0)) / 1000, 0) AS TrapoDistance, ROUND((IF(E.PlayerUID, COUNT(E.KilledEnemy), 0) / IF(E.PlayerUID, COUNT(E.KilledByEnemy), 0)), 1) AS KD, IFNULL((SELECT COUNT(*) FROM Contributions C WHERE C.PlayerUID = E.PlayerUID GROUP BY C.PlayerUID), 0) AS Participations FROM Events E INNER JOIN Players P ON E.PlayerUID = P.SteamID64 WHERE E.PlayerUID = ${STEAM64};" > ${TEMPDIR}/player.tmp
    while IFS=$'\t' read -r -a player
    do
	KILLS=${player[3]}
	REVIVES=${player[9]}
	FLAGS=${player[7]}
	TRAPO=${player[18]}
	VEHICLEKILLS=${player[8]}
	PARTICIPATIONS=${player[20]}

        echo ${PLAYER}/${PLAYERS} Rendering picture for ${STEAM64} ${NICK}... \(Kills: ${KILLS} / Revives: ${REVIVES} / Flags: ${FLAGS} / TrapoKM: ${TRAPO} / VehicleKills: ${VEHICLEKILLS} / Participations: ${PARTICIPATIONS}\)
	CMD="magick montage -background transparent "

	# Dienstgrad nach Anzahl der Schlachtteilnahmen
	if [ "${PARTICIPATIONS}" -ge "50" ]; then
	    CMD+="${ORDENDIR}/teamblau/general.svg "
	else
	    if [ "${PARTICIPATIONS}" -ge "48" ]; then
		CMD+="${ORDENDIR}/teamblau/generalleutnant.svg "
	    else
		if [ "${PARTICIPATIONS}" -ge "46" ]; then
		    CMD+="${ORDENDIR}/teamblau/generalmajor.svg "
		else
		    if [ "${PARTICIPATIONS}" -ge "44" ]; then
			CMD+="${ORDENDIR}/teamblau/brigadegeneral.svg "
		    else
			if [ "${PARTICIPATIONS}" -ge "42" ]; then
			    CMD+="${ORDENDIR}/teamblau/oberst.svg "
			else
			    if [ "${PARTICIPATIONS}" -ge "40" ]; then
				CMD+="${ORDENDIR}/teamblau/oberstleutnant.svg "
			    else
				if [ "${PARTICIPATIONS}" -ge "38" ]; then
				    CMD+="${ORDENDIR}/teamblau/major.svg "
				else
				    if [ "${PARTICIPATIONS}" -ge "36" ]; then
					CMD+="${ORDENDIR}/teamblau/hauptmann.svg "
				    else
					if [ "${PARTICIPATIONS}" -ge "34" ]; then
					    CMD+="${ORDENDIR}/teamblau/oberleutnant.svg "
					else
					    if [ "${PARTICIPATIONS}" -ge "32" ]; then
						CMD+="${ORDENDIR}/teamblau/leutnant.svg "
					    else
						if [ "${PARTICIPATIONS}" -ge "30" ]; then
						    CMD+="${ORDENDIR}/teamblau/oberstabsfeldwebel.svg "
						else
						    if [ "${PARTICIPATIONS}" -ge "28" ]; then
							CMD+="${ORDENDIR}/teamblau/stabsfeldwebel.svg "
						    else
							if [ "${PARTICIPATIONS}" -ge ""26 ]; then
							    CMD+="${ORDENDIR}/teamblau/stabsfeldwebel.svg "
							else
							    if [ "${PARTICIPATIONS}" -ge "24" ]; then
								CMD+="${ORDENDIR}/teamblau/hauptfeldwebel.svg "
							    else
								if [ "${PARTICIPATIONS}" -ge "22" ]; then
								    CMD+="${ORDENDIR}/teamblau/oberfeldwebel.svg "
								else
								    if [ "${PARTICIPATIONS}" -ge "20" ]; then
									CMD+="${ORDENDIR}/teamblau/feldwebel.svg "
								    else
									if [ "${PARTICIPATIONS}" -ge "18" ]; then
									    CMD+="${ORDENDIR}/teamblau/stabsunteroffizier.svg "
									else
									    if [ "${PARTICIPATIONS}" -ge "16" ]; then
										CMD+="${ORDENDIR}/teamblau/unteroffizier.svg "
									    else
										if [ "${PARTICIPATIONS}" -ge "14" ]; then
										    CMD+="${ORDENDIR}/teamblau/oberstabsgefreiter.svg "
										else
										    if [ "${PARTICIPATIONS}" -ge "10" ]; then
											CMD+="${ORDENDIR}/teamblau/stabsgefreiter.svg "
										    else
											if [ "${PARTICIPATIONS}" -ge "6" ]; then
											    CMD+="${ORDENDIR}/teamblau/hauptgefreiter.svg "
											else
											    if [ "${PARTICIPATIONS}" -ge "4" ]; then
												CMD+="${ORDENDIR}/teamblau/obergefreiter.svg "
											    else
												if [ "${PARTICIPATIONS}" -ge "2" ]; then
												    CMD+="${ORDENDIR}/teamblau/gefreiter.svg "
												else
												    CMD+="${ORDENDIR}/teamblau/schuetze.svg "
												fi
											    fi
											fi
										    fi
										fi
									    fi
									fi
								    fi
								fi
							    fi
							fi
						    fi
						fi
					    fi
					fi
				    fi
				fi
			    fi
			fi
		    fi
		fi
	    fi
	fi

	# Kills
	if [ "${KILLS}" -ge "150" ]; then
	    CMD+="${ORDENDIR}/orden/kills_gold.svg "
	else
	    if [ "${KILLS}" -ge "100" ]; then
		CMD+="${ORDENDIR}/orden/kills_silber.svg "
	    else
		if [ "${KILLS}" -ge "50" ]; then
		    CMD+="${ORDENDIR}/orden/kills_bronze.svg "
		fi
	    fi
	fi

	# Wiederbelebungen
	if [ "${REVIVES}" -ge "100" ]; then
	    CMD+="${ORDENDIR}/orden/sani_gold.svg "
	else
	    if [ "${REVIVES}" -ge "50" ]; then
		CMD+="${ORDENDIR}/orden/sani_silber.svg "
	    else
		if [ "${REVIVES}" -ge "25" ]; then
		    CMD+="${ORDENDIR}/orden/sani_bronze.svg "
		fi
	    fi
	fi

	# Flaggeneroberungen
	if [ "${FLAGS}" -ge "25" ]; then
	    CMD+="${ORDENDIR}/orden/fahne_gold.svg "
	else
	    if [ "${FLAGS}" -ge "10" ]; then
		CMD+="${ORDENDIR}/orden/fahne_silber.svg "
	    else
		if [ "${FLAGS}" -ge "5" ]; then
		    CMD+="${ORDENDIR}/orden/fahne_bronze.svg "
		fi
	    fi
	fi

	# Transport-Kilometer (Pilot + Fahrer + Kapitän)
	if [ "${TRAPO}" -ge "1000" ]; then
	    CMD+="${ORDENDIR}/orden/trapo_gold.svg "
	else
	    if [ "${TRAPO}" -ge "500" ]; then
		CMD+="${ORDENDIR}/orden/trapo_silber.svg "
	    else
		if [ "${TRAPO}" -ge "200" ]; then
		    CMD+="${ORDENDIR}/orden/trapo_bronze.svg "
		fi
	    fi
	fi

	# Fahrzeugzerstörungen
	if [ "${VEHICLEKILLS}" -ge "50" ]; then
	    CMD+="${ORDENDIR}/orden/pa_gold.svg "
	else
	    if [ "${VEHICLEKILLS}" -ge "25" ]; then
		CMD+="${ORDENDIR}/orden/pa_silber.svg "
	    else
		if [ "${VEHICLEKILLS}" -ge "10" ]; then
		    CMD+="${ORDENDIR}/orden/pa_bronze.svg "
		fi
	    fi
	fi

	# Purple Heart für die meisten Kills
	if [ "${STEAM64}" == "${MOSTKILLS}" ]; then
	    CMD+="${ORDENDIR}/orden/purple_heart.svg "
	fi

	# Purple Heart für die meisten Tode
	if [ "${STEAM64}" == "${MOSTDEATHS}" ]; then
	    CMD+="${ORDENDIR}/orden/purple_heart.svg "
	fi

	# Bild rendern
	CMD+="-tile x1 -geometry +5 -gravity north ${TEMPDIR}/tmp.png"
	${CMD}

	# Text ins Bild schreiben
	magick convert ${TEMPDIR}/tmp.png -resize x600 -fill white -pointsize 32 -draw "text 300,515 '${NICK}'" -pointsize 16 -draw "text 300,550 'Bei der OPT seit dem ${SINCE}'" ${WWWDIR}/${STEAM64}.png
	rm ${TEMPDIR}/tmp.png

    done < ${TEMPDIR}/player.tmp
    rm ${TEMPDIR}/player.tmp

done < ${TEMPDIR}/players.tmp
rm ${TEMPDIR}/players.tmp
