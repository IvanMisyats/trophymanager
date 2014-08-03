// ==UserScript==
// @name			TrophyManager - Players Page
// @description		Improved design of /Players/ page for Pro users. 
// @exclude			http://trophymanager.com/players/*/*
// @include			http://trophymanager.com/players
// @include			http://trophymanager.com/players/
// @exclude			https://trophymanager.com/players/*/*
// @include			https://trophymanager.com/players
// @include			https://trophymanager.com/players/
// @author			Ivan Misyats
// @github			https://github.com/IvanMisyats/trophymanager
// @grant			GM_log
// ==/UserScript==

$('head').append('<style type="text/css">\
	.training.part_down { \
		background: none;\
		border: 1px solid #900;\
		color: #B8D988;\
	}\
	.training.part_up {\
		background: none;\
		border: 1px solid #B3E06F;\
		color: #B8D988;\
	}\
	</style>');