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
		
		var hexR = jQuery.map((form.hexColor.value + "").split(""), function(d){return d;});
		var hexG = hexR.splice(2, 4);
		var hexB = hexG.splice(2, 2);
		var gradientR = makeGradient(hexR);
		var gradientG = makeGradient(hexG);
		var gradientB = makeGradient(hexB);
		var gradientLineTop = "";
		var gradientLineBottom = "";
		for (let i = 39; i >= 0; --i) {
			let color = gradientR[i] + gradientG[i] + gradientB[i];
			gradientLineTop = gradientLineTop + "[color=#" + color + "]▄[/color]";
			gradientLineBottom = gradientLineBottom + "[color=#" + color + "]▀[/color]";
		}
		gradientLineTop = gradientLineTop + "[color=#" + form.hexColor.value + "]▄[/color]";
		gradientLineBottom = gradientLineBottom + "[color=#" + form.hexColor.value + "]▀[/color]";
		for (let i = 0; i < 40; ++i) {
			let color = gradientR[i] + gradientG[i] + gradientB[i];
			gradientLineTop = gradientLineTop + "[color=#" + color + "]▄[/color]";
			gradientLineBottom = gradientLineBottom + "[color=#" + color + "]▀[/color]";
		}

		var nameLine = "";
		if (form.name.value != "") {
			nameLine = "[size=9][color=#" + form.hexColor.value + "]☙♥❧[/color][color=#ffffff]▀▀▀▀[/color][/size][color=#" + form.hexColor.value + "][size=24]«" + form.name.value + "»[/size][/color][size=9][color=#ffffff]▀▀▀▀[/color][color=#" + form.hexColor.value + "][size=9]☙♥❧[/color][/size]<br>";
		}
		document.getElementById("copyPasteTxt").innerHTML = "[align=center][img]https://" + form.imgUrl.value + "[/img]<br>" +	
			nameLine +
			gradientLineTop + "[/align]<br>" +
			"[color=#ffffff]▀▀▀[/color]" + form.mainBody.value + "<br><br>" +
			"[align=center]" + gradientLineBottom + "<br>" +
			"[size=9][color=#" + form.hexColor.value + "]«Location: " + form.location.value + "»[/color][color=#ffffff]▀▀▀▀[/color][color=#" + form.hexColor.value + "]☙♥❧[/color][color=#ffffff]▀▀▀▀[/color][color=#" + form.hexColor.value + "]«Mood: " + form.mood.value + "»[/color][color=#ffffff]▀▀▀▀[/color][color=#" + form.hexColor.value + "]☙♥❧[/color][color=#ffffff]▀▀▀▀[/color][color=#" + form.hexColor.value + "]«Condition: " + form.condition.value + "»[/color][color=#ffffff]▀▀▀▀[/color][color=#" + form.hexColor.value + "]☙♥❧[/color][color=#ffffff]▀▀▀▀[/color][color=#" + form.hexColor.value + "]«With: " + form.with.value + "»[/color]<br><br>" +
			"[spoiler][color=#" + form.hexColor.value + "]«OOC Comments: " + form.ooc.value + "»<br>" + 
			"«Credit: Layout built by [b][url=https://www.gaiaonline.com/profiles/vicky-barrett]Vicky Barrett's[/url][/b] post generator.»[/color][/size][/spoiler][/align]";
	}
});

$("#mainBody").keypress(function(button) {
	if (button.which == 13) {
		document.getElementById("mainBody").value = document.getElementById("mainBody").value + "\n\n<br><br>[color=#ffffff]▀▀▀[/color]";
		button.preventDefault();
	}
});