function makeGradient(color) {
	var hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g'];
	var lgDig = color[0].toString();
	var smDig = color[1].toString();
	var fullGradient = [];
	var reducedGradient = [];
	while (lgDig != 'g') {
		while (smDig != 'g') {
			fullGradient.push(lgDig + smDig);
			smDig = hexChars[hexChars.indexOf(smDig) + 1];
		}
		lgDig = hexChars[hexChars.indexOf(lgDig) + 1];
		smDig = '0';
	}
	var delAmount = fullGradient.length / 41;
	for (let i = 0; i < 40; ++i) {
		reducedGradient.push(fullGradient[Math.trunc(delAmount * i)]);
	}
	return reducedGradient;
}

$(document).on("keyup", function(button) {
	if (button.which == 16 || button.which == 17 || (button.which >= 37 && button.which <= 40)) {
		return;
	} else {
		var form = document.getElementById("postInfo");
		var mainColor = form.hexColor.value;
		var bbcode = {
			"gradientTop": "",
			"gradientBottom": "",
			"name": "",
			"imgUrl": "",
			"location": "",
			"mood": "",
			"condition": "",
			"with": "",
			"mainBody": "",
			"ooc": ""
		};

		var hexR = jQuery.map((mainColor + "").split(""), function(c){return c;});
		if (hexR[0] == '#') {
			hexR.splice(0, 1);
			mainColor = hexR[0] + hexR[1] + hexR[2] + hexR[3] + hexR[4] + hexR[5];
		}
		var hexG = hexR.splice(2, 4);
		var hexB = hexG.splice(2, 2);
		var gradientR = makeGradient(hexR);
		var gradientG = makeGradient(hexG);
		var gradientB = makeGradient(hexB);
		for (let i = 39; i >= 0; --i) {
			let color = gradientR[i] + gradientG[i] + gradientB[i];
			bbcode.gradientTop = bbcode.gradientTop + "[color=#" + color + "]▄[/color]";
			bbcode.gradientBottom = bbcode.gradientBottom + "[color=#" + color + "]▀[/color]";
		}
		bbcode.gradientTop = bbcode.gradientTop + "[color=#" + mainColor + "]▄[/color]";
		bbcode.gradientBottom = bbcode.gradientBottom + "[color=#" + mainColor + "]▀[/color]";
		for (let i = 0; i < 40; ++i) {
			let color = gradientR[i] + gradientG[i] + gradientB[i];
			bbcode.gradientTop = bbcode.gradientTop + "[color=#" + color + "]▄[/color]";
			bbcode.gradientBottom = bbcode.gradientBottom + "[color=#" + color + "]▀[/color]";
		}

		var bbcodeSpacer = "»[/color][color=transparent]▀▀▀▀[/color][color=#" + mainColor + "]☙♥❧[/color][color=transparent]▀▀▀▀[/color]";
		if (form.name.value != "") {
			bbcode.name = "[size=9][color=#" + mainColor + "]☙♥❧[/color][color=transparent]▀▀▀▀[/color][/size][color=#" + mainColor + "][size=24]" + form.name.value + "[/size][/color][size=9][color=transparent]▀▀▀▀[/color][color=#" + mainColor + "][size=9]☙♥❧[/color][/size]<br>";
		}
		if (form.imgUrl.value != "") {
			let urlArr = jQuery.map((form.imgUrl.value + "").split(""), function(c){return c;});
			if (urlArr[0] == 'h' && urlArr[1] == 't' && urlArr[2] == 't' && urlArr[3] == 'p' && (urlArr[4] == ':' || (urlArr[4] == 's' && urlArr[5] == ':'))) {
				bbcode.imgUrl = "[img]" + form.imgUrl.value + "[/img]<br>";
			} else {
				bbcode.imgUrl = "[img]https://" + form.imgUrl.value + "[/img]<br>";
			}
		}
		if (form.location.value != "") {
			bbcode.location = "[color=#" + mainColor + "]«Location: " + form.location.value + bbcodeSpacer;
		}
		if (form.mood.value != "") {
			bbcode.mood = "[color=#" + mainColor + "]«Mood: " + form.mood.value + bbcodeSpacer;
		}
		if (form.condition.value != "") {
			bbcode.condition = "[color=#" + mainColor + "]«Condition: " + form.condition.value + bbcodeSpacer;
		}
		if (form.with.value != "") {
			bbcode.with = "[color=#" + mainColor + "]«With: " + form.with.value + "»[/color]";
		} else if (bbcode.condition != "") {
			bbcode.condition = "[color=#" + mainColor + "]«Condition: " + form.condition.value + "»[/color]";
		} else if (bbcode.mood != "") {
			bbcode.mood = "[color=#" + mainColor + "]«Mood: " + form.mood.value + "»[/color]";
		} else if (bbcode.location != "") {
			bbcode.location = "[color=#" + mainColor + "]«Location: " + form.location.value + "»[/color]";
		}
		if (form.ooc.value != "") {
			bbcode.ooc = "«OOC Comments: " + form.ooc.value + "»<br>";
		}
		document.getElementById("copyPasteTxt").innerHTML = "[align=center]" + bbcode.imgUrl +	
			bbcode.name +
			bbcode.gradientTop + "[/align]<br>" +
			":tab:" + form.mainBody.value + "<br><br>" +
			"[align=center]" + bbcode.gradientBottom + "<br>" +
			"[size=9]" + bbcode.location + bbcode.mood + bbcode.condition + bbcode.with + "<br><br>" +
			"[spoiler][color=#" + mainColor + "]" + bbcode.ooc + 
			"«Credit: Layout built by [b][url=https://www.gaiaonline.com/profiles/vicky-barrett]Vicky Barrett's[/url][/b] post generator (v1.2).»[/color][/size][/spoiler][/align]";
	}
});

$("#mainBody").keypress(function(button) {
	if (button.which == 13) {
		document.getElementById("mainBody").value = document.getElementById("mainBody").value + "\n\n<br><br>:tab:";
		button.preventDefault();
	}
});