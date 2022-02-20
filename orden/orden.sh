#!/bin/bash

##########################
DB_NAME=opt
DB_USER=opt
DB_PASS=optpass

TEMPDIR=/tmp
ORDENDIR=/root/log/orden/resized
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
	SQL="SELECT SteamID64, Nickname, DATE_FORMAT(SeenFirst, '%d.%m.%Y') AS SeenFirst FROM Players WHERE SteamID64 != 0 ORDER BY SeenLast DESC;"
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
    mariadb -u ${DB_USER} -p${DB_PASS} ${DB_NAME} --skip-column-names --silent --execute="WITH Contributions AS (SELECT PlayerUID, MissionID FROM Events GROUP BY PlayerUID, MissionID), Campaigns AS (SELECT PlayerUID, CampaignID FROM Events GROUP BY PlayerUID, CampaignID) SELECT E.PlayerUID, P.Nickname AS Name, E.PlayerSide, IF(E.PlayerUID, COUNT(E.KilledEnemy), 0) AS Kills, IF(E.PlayerUID, COUNT(E.KilledTeammate), 0) AS Teamkills, IF(E.PlayerUID, COUNT(E.KilledByEnemy), 0) AS DeathsByEnemy, IF(E.PlayerUID, COUNT(E.KilledByTeammate), 0) AS DeathsByTeammate, IF(E.PlayerUID, COUNT(E.FlagDistance), 0) AS FlagConquers, IF(E.PlayerUID, COUNT(E.KilledVehicleName), 0) AS Vehiclekills, IF(E.PlayerUID, COUNT(E.RevivedTeammate), 0) AS Revives, IF(E.PlayerUID, (COUNT(E.RespawnClick) + COUNT(RespawnTimeout)), 0) AS Respawns, IF(E.PlayerUID, (IFNULL(SUM(E.BudgetBuy), 0) - IFNULL(SUM(BudgetSell), 0)), 0) AS Cost, IF(E.PlayerUID, ROUND(MAX(E.KillDistance)), 0) AS MaxKillDistance, ROUND(AVG(E.FPS), 1) AS FPS, ROUND(IFNULL(SUM(E.PilotDistance), 0) / 1000, 0) AS PilotDistance, ROUND(IFNULL(SUM(E.AirPassengerDistance), 0) / 1000, 0) AS AirPassengerDistance, ROUND(IFNULL(SUM(E.DriverDistance), 0) / 1000, 0) AS DriverDistance, ROUND(IFNULL(SUM(E.DrivePassengerDistance), 0) / 1000, 0) AS DrivePassengerDistance, ROUND((IFNULL(SUM(E.PilotDistance), 0) + IFNULL(SUM(E.DriverDistance), 0) + IFNULL(SUM(E.BoatDistance), 0)) / 1000, 0) AS TrapoDistance, ROUND((IF(E.PlayerUID, COUNT(E.KilledEnemy), 0) / IF(E.PlayerUID, COUNT(E.KilledByEnemy), 0)), 1) AS KD, IFNULL((SELECT COUNT(*) FROM Contributions C WHERE C.PlayerUID = E.PlayerUID GROUP BY C.PlayerUID), 0) AS Participations, IFNULL((SELECT COUNT(*) FROM Campaigns CA WHERE CA.PlayerUID = E.PlayerUID GROUP BY CA.PlayerUID), 0) AS Kampagnen FROM Events E INNER JOIN Players P ON E.PlayerUID = P.SteamID64 WHERE E.PlayerUID = ${STEAM64};" > ${TEMPDIR}/player.tmp
    while IFS=$'\t' read -r -a player
    do
	KILLS=${player[3]}
	REVIVES=${player[9]}
	FLAGS=${player[7]}
	TRAPO=${player[18]}
	VEHICLEKILLS=${player[8]}
	PARTICIPATIONS=${player[20]}
	CAMPAIGNS=${player[21]}

        echo ${PLAYER}/${PLAYERS} Rendering picture for ${STEAM64} ${NICK}... \(Kills: ${KILLS} / Revives: ${REVIVES} / Flags: ${FLAGS} / TrapoKM: ${TRAPO} / VehicleKills: ${VEHICLEKILLS} / Participations: ${PARTICIPATIONS} / Campaigns: ${CAMPAIGNS}\)
	CMD="magick montage -background transparent -fill white -pointsize 12 -gravity north \( "

	# Dienstgrad nach Anzahl der Schlachtteilnahmen
	if [ "${PARTICIPATIONS}" -ge "50" ]; then
	    CMD+="-annotate +0+5 General ${ORDENDIR}/schulterklappen/general.png "
	else
	    if [ "${PARTICIPATIONS}" -ge "48" ]; then
		CMD+="-annotate +0+5 Generalleutnant ${ORDENDIR}/schulterklappen/generalleutnant.png "
	    else
		if [ "${PARTICIPATIONS}" -ge "46" ]; then
		    CMD+="-annotate +0+5 Generalmajor ${ORDENDIR}/schulterklappen/generalmajor.png "
		else
		    if [ "${PARTICIPATIONS}" -ge "44" ]; then
			CMD+="-annotate +0+5 Brigadegeneral ${ORDENDIR}/schulterklappen/brigadegeneral.png "
		    else
			if [ "${PARTICIPATIONS}" -ge "42" ]; then
			    CMD+="-annotate +0+5 Oberst ${ORDENDIR}/schulterklappen/oberst.png "
			else
			    if [ "${PARTICIPATIONS}" -ge "40" ]; then
				CMD+="-annotate +0+5 Oberstleutnant ${ORDENDIR}/schulterklappen/oberstleutnant.png "
			    else
				if [ "${PARTICIPATIONS}" -ge "38" ]; then
				    CMD+="-annotate +0+5 Major ${ORDENDIR}/schulterklappen/major.png "
				else
				    if [ "${PARTICIPATIONS}" -ge "36" ]; then
					CMD+="-annotate +0+5 Hauptmann ${ORDENDIR}/schulterklappen/hauptmann.png "
				    else
					if [ "${PARTICIPATIONS}" -ge "34" ]; then
					    CMD+="-annotate +0+5 Oberleutnant ${ORDENDIR}/schulterklappen/oberleutnant.png "
					else
					    if [ "${PARTICIPATIONS}" -ge "32" ]; then
						CMD+="-annotate +0+5 Leutnant ${ORDENDIR}/schulterklappen/leutnant.png "
					    else
						if [ "${PARTICIPATIONS}" -ge "30" ]; then
						    CMD+="-annotate +0+5 Oberstabsfeldwebel ${ORDENDIR}/schulterklappen/oberstabsfeldwebel.png "
						else
						    if [ "${PARTICIPATIONS}" -ge ""26 ]; then
							CMD+="-annotate +0+5 Stabsfeldwebel ${ORDENDIR}/schulterklappen/stabsfeldwebel.png "
						    else
							if [ "${PARTICIPATIONS}" -ge "24" ]; then
							    CMD+="-annotate +0+5 Hauptfeldwebel ${ORDENDIR}/schulterklappen/hauptfeldwebel.png "
							else
							    if [ "${PARTICIPATIONS}" -ge "22" ]; then
								CMD+="-annotate +0+5 Oberfeldwebel ${ORDENDIR}/schulterklappen/oberfeldwebel.png "
							    else
								if [ "${PARTICIPATIONS}" -ge "20" ]; then
								    CMD+="-annotate +0+5 Feldwebel ${ORDENDIR}/schulterklappen/feldwebel.png "
								else	
								    if [ "${PARTICIPATIONS}" -ge "18" ]; then
									CMD+="-annotate +0+5 Stabsunteroffizier ${ORDENDIR}/schulterklappen/stabsunteroffizier.png "
								    else
									if [ "${PARTICIPATIONS}" -ge "16" ]; then
									    CMD+="-annotate +0+5 Unteroffizier ${ORDENDIR}/schulterklappen/unteroffizier.png "
									else
									    if [ "${PARTICIPATIONS}" -ge "14" ]; then
										CMD+="-annotate +0+5 Oberstabsgefreiter ${ORDENDIR}/schulterklappen/oberstabsgefreiter.png "
									    else
										if [ "${PARTICIPATIONS}" -ge "10" ]; then
										    CMD+="-annotate +0+5 Stabsgefreiter ${ORDENDIR}/schulterklappen/stabsgefreiter.png "
										else
										    if [ "${PARTICIPATIONS}" -ge "6" ]; then
											CMD+="-annotate +0+5 Hauptgefreiter ${ORDENDIR}/schulterklappen/hauptgefreiter.png "
										    else
											if [ "${PARTICIPATIONS}" -ge "4" ]; then
											    CMD+="-annotate +0+5 Obergefreiter ${ORDENDIR}/schulterklappen/obergefreiter.png "
											else
											    if [ "${PARTICIPATIONS}" -ge "2" ]; then
												CMD+="-annotate +0+5 Gefreiter ${ORDENDIR}/schulterklappen/gefreiter.png "
											    else
												CMD+="-annotate +0+5 Schütze ${ORDENDIR}/schulterklappen/schuetze.png "
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
	    CMD+="\) \( -annotate +0+5 §${KILLS} Feindabschüsse§ ${ORDENDIR}/orden/kills_gold.png "
	else
	    if [ "${KILLS}" -ge "100" ]; then
		CMD+="\) \( -annotate +0+5 §${KILLS} Feindabschüsse§ ${ORDENDIR}/orden/kills_silber.png "
	    else
		if [ "${KILLS}" -ge "50" ]; then
		    CMD+="\) \( -annotate +0+5 §${KILLS} Feindabschüsse§ ${ORDENDIR}/orden/kills_bronze.png "
		fi
	    fi
	fi

	# Wiederbelebungen
	if [ "${REVIVES}" -ge "100" ]; then
	    CMD+="\) \( -annotate +0+5 §${REVIVES} Wiederbelebungen§ ${ORDENDIR}/orden/sani_gold.png "
	else
	    if [ "${REVIVES}" -ge "50" ]; then
		CMD+="\) \( -annotate +0+5 §${REVIVES} Wiederbelebungen§ ${ORDENDIR}/orden/sani_silber.png "
	    else
		if [ "${REVIVES}" -ge "25" ]; then
		    CMD+="\) \( -annotate +0+5 §${REVIVES} Wiederbelebungen§ ${ORDENDIR}/orden/sani_bronze.png "
		fi
	    fi
	fi

	# Flaggeneroberungen
	if [ "${FLAGS}" -ge "25" ]; then
	    CMD+="\) \( -annotate +0+5 §${FLAGS} Flaggeneroberungen§ ${ORDENDIR}/orden/fahne_gold.png "
	else
	    if [ "${FLAGS}" -ge "10" ]; then
		CMD+="\) \( -annotate +0+5 §${FLAGS} Flaggeneroberungen§ ${ORDENDIR}/orden/fahne_silber.png "
	    else
		if [ "${FLAGS}" -ge "5" ]; then
		    CMD+="\) \( -annotate +0+5 §${FLAGS} Flaggeneroberungen§ ${ORDENDIR}/orden/fahne_bronze.png "
		fi
	    fi
	fi

	# Transport-Kilometer (Pilot + Fahrer + Kapitän)
	if [ "${TRAPO}" -ge "1000" ]; then
	    CMD+="\) \( -annotate +0+5 §${TRAPO} Transportkilometer§ ${ORDENDIR}/orden/trapo_gold.png "
	else
	    if [ "${TRAPO}" -ge "500" ]; then
		CMD+="\) \( -annotate +0+5 §${TRAPO} Transportkilometer§ ${ORDENDIR}/orden/trapo_silber.png "
	    else
		if [ "${TRAPO}" -ge "200" ]; then
		    CMD+="\) \( -annotate +0+5 §${TRAPO} Transportkilometer§ ${ORDENDIR}/orden/trapo_bronze.png "
		fi
	    fi
	fi

	# Fahrzeugzerstörungen
	if [ "${VEHICLEKILLS}" -ge "50" ]; then
	    CMD+="\) \( -annotate +0+5 §${VEHICLEKILLS} Fahrzeugzerstörungen§ ${ORDENDIR}/orden/pa_gold.png "
	else
	    if [ "${VEHICLEKILLS}" -ge "25" ]; then
		CMD+="\) \( -annotate +0+5 §${VEHICLEKILLS} Fahrzeugzerstörungen§ ${ORDENDIR}/orden/pa_silber.png "
	    else
		if [ "${VEHICLEKILLS}" -ge "10" ]; then
		    CMD+="\) \( -annotate +0+5 §${VEHICLEKILLS} Fahrzeugzerstörungen§ ${ORDENDIR}/orden/pa_bronze.png "
		fi
	    fi
	fi

	# Purple Heart für die meisten Kills
	if [ "${STEAM64}" == "${MOSTKILLS}" ]; then
	    CMD+="\) \( -annotate +0+5 §Purple Heart§ ${ORDENDIR}/orden/purple_heart.png "
	fi

	# Purple Heart für die meisten Tode
	if [ "\) \( -annotate +0+5 §Purple Heart§ ${STEAM64}" == "${MOSTDEATHS}" ]; then
	    CMD+="${ORDENDIR}/orden/purple_heart.png "
	fi

	# Bild rendern
	CMD+="\) -tile x1 -geometry +5 -gravity northwest ${TEMPDIR}/tmp.png"
	echo "${CMD}" | sed s/§/\"/g | sh

	# Text ins Bild schreiben
	magick convert ${TEMPDIR}/tmp.png -background transparent -gravity northwest -extent 1200 -fill white -pointsize 32 -draw "text 200,360 '${NICK}'" -pointsize 16 -draw "text 200,395 'Bei der OPT seit dem ${SINCE}'" \( -font URWBookman-Demi -fill rgba\(155,155,155,0.35\) -pointsize 120 -gravity center caption:"BETA" -rotate -15 \) -geometry +100+140 -compose over -composite  ${WWWDIR}/${STEAM64}.png
	rm ${TEMPDIR}/tmp.png

    done < ${TEMPDIR}/player.tmp
    rm ${TEMPDIR}/player.tmp

done < ${TEMPDIR}/players.tmp
rm ${TEMPDIR}/players.tmp
