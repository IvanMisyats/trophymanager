// ==UserScript==
// @name		   TrophyManager - Super Profile Page
// @description	In TrophyManager.com Shows TrExMa Value for Favorite Positions for Player
// @include		http://trophymanager.com/players/*
// @exclude		http://trophymanager.com/players
// @include		https://trophymanager.com/players/*
// @exclude		https://trophymanager.com/players
// @author    	  Joao Manuel Ferreira Fernandes
// @github		  https://github.com/IvanMisyats/trophymanager
// @grant 		GM_log
// ==/UserScript==

// show an error
function error(message) {
	GM_log(message);
};

if (location.href.indexOf("/players/") != -1) {
	function getUserLanguage() {
		return document.cookie.match(/trophymanager\[language\]=(\w+)/)[1] || "uk";
	};
	var userLanguage = getUserLanguage();

	// Array to setup the weights of particular skills for each player's actual ability
	// This is the direct weight to be given to each skill.
	// Array maps to these skills:
	//		 [Str,Sta,Pac,Mar,Tac,Wor,Pos,Pas,Cro,Tec,Hea,Fin,Lon,Set]
	var positions = 
			[[  1,  3,  1,  1,  1,  3,  3,  2,  2,  2,  1,  3,  3,  3], // D C
			 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // D L
			 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // D R
			 [  1,  2,  2,  1,  1,  1,  1,  1,  2,  2,  1,  3,  3,  3], // DM C
			 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // DM L
			 [  2,  3,  1,  1,  1,  3,  3,  2,  2,  2,  2,  3,  3,  3], // DM R
			 [  2,  2,  3,  1,  1,  1,  1,  1,  3,  1,  2,  3,  3,  3], // M C 
			 [  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3], // M L
			 [  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3], // M R
			 [  2,  3,  3,  2,  2,  1,  1,  1,  3,  1,  2,  1,  1,  3], // OM C
			 [  2,  2,  1,  3,  3,  2,  2,  3,  1,  1,  2,  2,  2,  3], // OM L
			 [  2,  2,  1,  3,  3,  2,  2,  3,  1,  1,  2,  2,  2,  3], // OM R
			 [  1,  2,  2,  3,  3,  2,  2,  3,  3,  2,  1,  1,  1,  3], // F
			 [  2,  3,  2,  1,  2,  1,  2,  2,  3,  3,  3]]; // Gk


	// [  2,  3,  2,  1,  2,  1,  2,  2,  3,  3,  3]
	// Weights need to total 100
	var weights = [ [85,12, 3],  // D C
			[70,25, 5],  // D L
			[70,25, 5],  // D R
			[90,10, 0],  // DM C
			[50,40,10],  // DM L
			[50,40,10],  // DM R
			[85,12, 3],  // M C			   
			[90, 7, 3],  // M L
			[90, 7, 3],  // M R
			[90,10, 0],  // OM C
			[60,35, 5],  // OM L
			[60,35, 5],  // OM R
			[80,18, 2],  // F
			[50,42, 8]]; // GK

	var positionNames = ["D C", "D L", "D D", "DM C", "DM L", "DM R", "M C", "M L", "M R", "OM C", "OM L", "OM R", "F", "Gk"];
	var positionFullNames = {
		uk: ["defender center", "defender left", "defender right", "defensive midfielder center", "defensive midfielder left", "defensive midfielder right", "midfielder center", "midfielder left", "midfielder right", "offensive midfielder center", "offensive midfielder left", "offensive midfielder right", "forward", "goalkeeper"],
		ua: ["захисник центральний", "захисник лівий", "захисник right", "опорний півзахисник центральний", "опорний півзахисник лівий", "опорний півзахисник right", "півзахисник центральний", "півзахисник лівий", "півзахисник правий", "атакувальний півзахисник центральний", "атакувальний півзахисник лівий", "атакувальний півзахисник правий", "нападник", "воротар"],
	}[userLanguage];

	// positionIndex is the array of skill priority for this player.
	// skills is an array of skills for each user
	
	document.calculateSkill = function(positionIndex, skills) {
		
		var totSkill = [0,0,[0, 0, 0],[0,0,0,0,0],[0,0,0,0,0]];
		var finReg;
		var finCab;
		var finRem;

		for (var i=0; i< positions[positionIndex].length; i++) {
			if (skills[i]>0) {
				totSkill[0] += skills[i]*document.calculateSkillWeight(positions[positionIndex], weights[positionIndex], i);

			}
		}
		for (var i=0; i< skills.length; i++) {
			totSkill[1] = totSkill[1]*1 + skills[i]*1;
		}
		totSkill[0] = totSkill[0] / 200; 

		if(positionIndex == 13){
			totSkill[1] = totSkill[1]*100/220;
		} else {
			totSkill[1] = totSkill[1]*100/280;
		}

		totSkill[1] = (totSkill[0] - totSkill[1]);
		totSkill[0] = Math.round(totSkill[0]*1000)/1000;
		totSkill[1] = Math.round(totSkill[1]*1000)/1000;	
		
		//set pieces
		totSkill[2][0] = ((skills[8]*2+skills[13]*2)+skills[9]*1)/5;// corner
		totSkill[2][1] = ((skills[12]*2+skills[13]*2)+skills[9]*1)/5;// Free kick
		totSkill[2][2] = ((skills[11]*2+skills[13]*2)+skills[9]*1)/5;// penalty
		
		if(positionIndex != 13){ // is not goalkeeper
			totSkill[3][0] =(skills[3]*3+skills[6]*3+skills[5]*3+skills[4]*2+skills[2]*2+skills[1]*1)/280;
			totSkill[3][1] =(skills[2]*3+skills[4]*3+skills[3]*3+skills[6]*2+skills[5]*2+skills[1]*1+skills[0]*1)/300;
			totSkill[3][2] =(skills[3]*3+skills[6]*3+skills[5]*3+skills[4]*2+skills[2]*2+skills[1]*1)/280;
			totSkill[3][3] =(skills[3]*3+skills[2]*3+skills[6]*3+skills[5]*3+skills[0]*2+skills[10]*2+skills[4]*2+skills[1]*1)/380;
			totSkill[3][4] =(skills[2]*3+skills[3]*2+skills[4]*2+skills[6]*1+skills[5]*1+skills[1]*1)/200;
			
			totSkill[3][0] = Math.round(totSkill[3][0]*100);
			totSkill[3][1] = Math.round(totSkill[3][1]*100);
			totSkill[3][2] = Math.round(totSkill[3][2]*100);
			totSkill[3][3] = Math.round(totSkill[3][3]*100);
			totSkill[3][4] = Math.round(totSkill[3][4]*100);
			
			// calculate the potential game style
			
			totSkill[4][0] = (skills[2]*3+skills[1]*3+skills[7]*3+skills[6]*2+skills[5]*2)/260;
			totSkill[4][1] = (skills[2]*3+skills[9]*3+skills[8]*3+skills[5]*2+skills[1]*2+skills[0]*1)/280;
			totSkill[4][2] = (skills[7]*3+skills[9]*3+skills[5]*2+skills[2]*2+skills[6]*2+skills[1]*2)/280;
			totSkill[4][3] = (skills[7]*3+skills[8]*2+skills[9]*2+skills[6]*1+skills[5]*1+skills[1]*1)/200;
			totSkill[4][4] = (skills[7]*3+skills[9]*3+skills[8]*3+skills[6]*2+skills[5]*2+skills[7]*2+skills[1]*2)/340;
		
			totSkill[4][0] = Math.round(totSkill[4][0]*100);
			totSkill[4][1] = Math.round(totSkill[4][1]*100);
			totSkill[4][2] = Math.round(totSkill[4][2]*100);
			totSkill[4][3] = Math.round(totSkill[4][3]*100);
			totSkill[4][4] = Math.round(totSkill[4][4]*100);
			
			finReg = Math.round((skills[11]*3+skills[9]*3+skills[6]*2+skills[5]*2+skills[0]*1+skills[1]*1+skills[2]*1)/260*100);
			finCab = Math.round((skills[10]*3+skills[0]*2+skills[6]*2+skills[5]*1+skills[2]*1)/180*100);
			finRem = Math.round((skills[13]*3+skills[9]*3+skills[11]*2+skills[6]*1+skills[1]*1)/200*100);
		
			// calculate the potential attacking style
			
			if(positionIndex == 12){//F
				totSkill[4][0] = totSkill[4][0]*0.2 + ((finReg*3+finCab*2+finRem*1)/6)*0.8;
				totSkill[4][1] = totSkill[4][1]*0.2 + ((finReg*2+finCab*3+finRem*1)/6)*0.8;
				totSkill[4][2] = totSkill[4][2]*0.2 + ((finReg*3+finCab*1+finRem*2)/6)*0.8;
				totSkill[4][3] = totSkill[4][3]*0.2 + ((finReg*1+finCab*4+finRem*1)/6)*0.8;
				totSkill[4][4] = totSkill[4][4]*0.2 + ((finReg*4+finCab*1+finRem*1)/6)*0.8; 
			}
			if(positionIndex >= 9 && positionIndex <= 11){//OM
				totSkill[4][0] = totSkill[4][0]*0.45 + ((finReg*3+finCab*2+finRem*1)/6)*0.55;
				totSkill[4][1] = totSkill[4][1]*0.45 + ((finReg*2+finCab*3+finRem*1)/6)*0.55;
				totSkill[4][2] = totSkill[4][2]*0.45 + ((finReg*3+finCab*1+finRem*2)/6)*0.55;
				totSkill[4][3] = totSkill[4][3]*0.45 + ((finReg*1+finCab*4+finRem*1)/6)*0.55;
				totSkill[4][4] = totSkill[4][4]*0.45 + ((finReg*4+finCab*1+finRem*1)/6)*0.55; 			
			}
			if(positionIndex >= 6 && positionIndex <= 8){//M
				totSkill[4][0] = totSkill[4][0]*0.55 + ((finReg*3+finCab*2+finRem*1)/6)*0.45;
				totSkill[4][1] = totSkill[4][1]*0.55 + ((finReg*2+finCab*3+finRem*1)/6)*0.45;
				totSkill[4][2] = totSkill[4][2]*0.55 + ((finReg*3+finCab*1+finRem*2)/6)*0.45;
				totSkill[4][3] = totSkill[4][3]*0.55 + ((finReg*1+finCab*4+finRem*1)/6)*0.45;
				totSkill[4][4] = totSkill[4][4]*0.55 + ((finReg*4+finCab*1+finRem*1)/6)*0.45; 
			}
			if(positionIndex >= 3 && positionIndex <= 5){//DM
				totSkill[4][0] = totSkill[4][0]*0.65 + ((finReg*3+finCab*2+finRem*1)/6)*0.35;
				totSkill[4][1] = totSkill[4][1]*0.65 + ((finReg*2+finCab*3+finRem*1)/6)*0.35;
				totSkill[4][2] = totSkill[4][2]*0.65 + ((finReg*3+finCab*1+finRem*2)/6)*0.35;
				totSkill[4][3] = totSkill[4][3]*0.65 + ((finReg*1+finCab*4+finRem*1)/6)*0.35;
				totSkill[4][4] = totSkill[4][4]*0.65 + ((finReg*4+finCab*1+finRem*1)/6)*0.35; 	
			}
			if(positionIndex <= 2){//D
				totSkill[4][0] = totSkill[4][0]*0.90 + ((finReg*3+finCab*2+finRem*1)/6)*0.10;
				totSkill[4][1] = totSkill[4][1]*0.90 + ((finReg*2+finCab*3+finRem*1)/6)*0.10;
				totSkill[4][2] = totSkill[4][2]*0.90 + ((finReg*3+finCab*1+finRem*2)/6)*0.10;
				totSkill[4][3] = totSkill[4][3]*0.90 + ((finReg*1+finCab*4+finRem*1)/6)*0.10;
				totSkill[4][4] = totSkill[4][4]*0.90 + ((finReg*4+finCab*1+finRem*1)/6)*0.10; 			
				// different weights to different positions
			}
			
			totSkill[4][0] = Math.round(totSkill[4][0]);
			totSkill[4][1] = Math.round(totSkill[4][1]);
			totSkill[4][2] = Math.round(totSkill[4][2]);
			totSkill[4][3] = Math.round(totSkill[4][3]);
			totSkill[4][4] = Math.round(totSkill[4][4]);
		}
		return totSkill;
	};
	
	document.calculateSkillWeight = function(positionWeightLevels, weights, index) {
		var weight = 0;
		weight = weights[positionWeightLevels[index]-1] / document.numberAtWeight(positionWeightLevels, positionWeightLevels[index]) * 10;
		return weight;
	};
	
	document.numberAtWeight = function(positionWeightLevels, value) {
		var count = 0;
		for (var i=0; i< positionWeightLevels.length; i++) {
			if (positionWeightLevels[i] == value) {
				count++;
			}
		}
		return count;
	};

	document.findPositionIndex = function(position) {
		if (!positionFullNames) {
			return -1;
		}

		position = position.toLowerCase();

		var index = -1;
		for (var k=0; k< positionFullNames.length; k++) {
			if (position.indexOf(positionFullNames[k]) == 0) {
				index = k;
				k = positionFullNames.length;
			}
		}
		return index;
	};
	
	document.getSkills = function(table) {
		var skillArray = [];
		var tableData = table.getElementsByTagName("td");
		if (tableData.length > 1) {
			for (var i = 0; i < 2; i++) {
				for (var j = i; j < tableData.length; j += 2) {
					if (tableData[j].innerHTML.indexOf("star.png") > 0) {
						skillArray.push(20);
					}
					else if (tableData[j].innerHTML.indexOf("star_silver.png") > 0) {
						skillArray.push(19);
					}
					else if (tableData[j].textContent.length != 0) {
						skillArray.push(tableData[j].textContent);
					}
				}
			}
		}
		return skillArray;
	};

	function computeSK(skills){
		var SKs = [0, 0];
		var Gok = [0, 0];
		var setP = [0, 0, 0];
		var defending = [0, 0, 0, 0, 0];
		var gameplayStyle = [0, 0, 0, 0, 0];
		var Pos = -1;
		var positionCell = document.getElementsByClassName("favposition long")[0].childNodes;
		var positionArray = [];

		if (positionCell.length == 1){
				positionArray[0] = positionCell[0].textContent;
		} else if (positionCell.length == 2){
				positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
		} else if (positionCell[1].className == "split"){
				positionArray[0] = positionCell[0].textContent + positionCell[3].textContent;
				positionArray[1] = positionCell[2].textContent + positionCell[3].textContent;
		} else if (positionCell[3].className == "f"){
				positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
				positionArray[1] = positionCell[3].textContent;
		} else {
				positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
				positionArray[1] = positionCell[0].textContent + positionCell[3].textContent;
		}

		for (var i = 0; i < positionArray.length; i++){
				var positionIndex = document.findPositionIndex(positionArray[i]);
				var skillAntes=0;
				if (positionIndex > -1) {
					var result = document.calculateSkill(positionIndex, skills);
					SKs[i] = result[0];
					Gok[i] = result[1];
					setP = result[2];
					defending = result[3];
					if(result[0]>=skillAntes){
						gameplayStyle = result[4];
					} 
					Pos = positionIndex;
					skillAntes = result[0];
				}
		}
		
		return [SKs,Gok,Pos,setP,defending,gameplayStyle];
	}
	
	document.createTR = function(table, SKarray) {
		var SK1 = SKarray[0],
			SK2 = SKarray[1] == 0 ? "N/A" : SKarray[1];
		var $row = $('<tr>\
			<th>SK1</th>\
			<td class="align_center">'+ SK1 +'</td>\
			<th>SK2</th>\
			<td class="align_center">' + SK2 + '</td>\
		</tr>');

		$(table).append($row);
	};

	document.createTRGok = function(table, SKarray) {
		var GokSK1 = SKarray[0],
			GokSK2 = SKarray[1] == 0 ? "N/A" : SKarray[1];
		var $row = $('<tr>\
			<th>GokSK1</th>\
			<td class="align_center">'+ GokSK1 +'</td>\
			<th>GokSK2</th>\
			<td class="align_center">' + GokSK2 + '</td>\
		</tr>');

		$(table).append($row);
	};
	
	document.createTRSetPieces = function(table, nome, SK) {
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = "";
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		td.innerHTML = "";
		tr.appendChild(td);
		var th = document.createElement("th");
		th.innerHTML = nome;
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		td.innerHTML = SK;
		tr.appendChild(td);
		table.appendChild(tr);
	};	
	
	document.createTRtwoSides = function(table, nome1, SK1, nome2, SK2) {
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = nome1;
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		td.innerHTML = SK1;
		tr.appendChild(td);
		var th = document.createElement("th");
		th.innerHTML = nome2;
		tr.appendChild(th);
		var td = document.createElement("td");
		td.setAttribute("class", "align_center");
		td.innerHTML = SK2;
		tr.appendChild(td);
		table.appendChild(tr);
	};	
	
	(function() {
		var playerTable = document.getElementsByClassName("skill_table zebra")[0];
		var skillArray = document.getSkills(playerTable);

		var computedSkills = computeSK(skillArray);

		if (computedSkills[2] == -1) {
			error('Language '+ userLanguage + ' is not supported');
			return;
		}

		var SKs = computedSkills[0];
		var Goks = computedSkills[1];
		var defending = computedSkills[4];
		var setPieces = computedSkills[3];
		var gameplayStyle = computedSkills[5];

		document.createTR(playerTable, SKs);
		document.createTRGok(playerTable, Goks);

		if(computeSK(skillArray)[2] != 13){
			document.createTRtwoSides(playerTable, "Def. Direct", defending[0]+"%", "Play Direct", gameplayStyle[0]+"%");
			document.createTRtwoSides(playerTable, "Def. Wings", defending[1]+"%", "Play Wings", gameplayStyle[1]+"%");
			document.createTRtwoSides(playerTable, "Def. Shorpassing", defending[2]+"%", "Play Shorpassing", gameplayStyle[2]+"%");
			document.createTRtwoSides(playerTable, "Def. Long Balls", defending[3]+"%", "Play Long Balls", gameplayStyle[3]+"%");
			document.createTRtwoSides(playerTable, "Def. Through Balls", defending[4]+"%", "Play Through Balls", gameplayStyle[4]+"%");

			document.createTRSetPieces(playerTable, "Corner Kicks 0-20", setPieces[0]);
			document.createTRSetPieces(playerTable, "Free Kicks 0-20", setPieces[1]);
			document.createTRSetPieces(playerTable, "Penalty Kicks 0-20", setPieces[2]); 
		}
		
	})();
}