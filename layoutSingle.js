var colorpickersCustom = KellyColorPicker.attachToInputByClass("hexColor", {
	alpha_slider: false,
	size: 150,
	popupClass: "popupColorPicker"
});

var mainBodyParagraphs = {
	"list": ["mainBody1"],
	"fullPassage": "",
	"updatePassage": function() {
		this.fullPassage = "";
		for (let i = 0; i < this.list.length; ++i) {
			if (i == 0) {
				this.fullPassage = document.getElementById(this.list[i]).value;
			} else {
				this.fullPassage = this.fullPassage + "<br><br>:tab: " + document.getElementById(this.list[i]).value;
			}
		}
	}
}

var copyPasteCode = "";

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

function updateBbcode(button) {
	if (button.which == 16 || button.which == 17 || (button.which >= 37 && button.which <= 40)) {
		return;
	} else {
		var form = document.getElementById("postInfo");
		var bbcode = {
			"color": form.hexColor.value,
			"gradientTop": "",
			"gradientBottom": "",
			"name": "",
			"imgUrl": "",
			"location": "",
			"mood": "",
			"condition": "",
			"with": "",
			"mainBodyMargin": "",
			"mainBody": "",
			"ooc": "",
			"copyPaste": ""
		};
		mainBodyParagraphs.updatePassage();
		var mainBodyCount = {
			"lines": 0,
			"content": mainBodyParagraphs.fullPassage,
			"update": function() {
				function removeSpacing(content, spacingCount) {
					if (content.search("<br><br>:tab: ") <= -1) {
						return {"content":content, "spacingCount":spacingCount};
					} else {
						++spacingCount;
						var contentArr = jQuery.map((content + "").split(""), function(c){return c;});
						var newContent = "";
						contentArr.splice(content.search("<br><br>:tab: "), 14);
						for (let i = 0; i < contentArr.length; ++i) {
							newContent = newContent + contentArr[i];
						}
						content = newContent;
						return removeSpacing(content, spacingCount);
					}
				}
				let contentObj = removeSpacing(this.content, 0);
				this.content = contentObj.content;
				this.lines = Math.trunc(this.content.length / 65) + 1 + (contentObj.spacingCount * 2);
			}
		}
		mainBodyCount.update();
		if (mainBodyCount.lines < 15) {
			bbcode.mainBodyMargin = "[imgleft]https://i.imgur.com/VV0U5zc.jpg[/imgleft][imgright]https://i.imgur.com/VV0U5zc.jpg[/imgright]";
		}

		var hexR = jQuery.map((bbcode.color + "").split(""), function(c){return c;});
		if (hexR[0] == '#') {
			var newColor = "";
			hexR.splice(0, 1);
			for (let i = 0; i < hexR.length; ++i) {
				newColor = newColor + hexR[i];
			}
			bbcode.color = newColor;
		}
		var hexG = hexR.splice(2, 4);
		var hexB = hexG.splice(2, 2);
		var gradientR = makeGradient(hexR);
		var gradientG = makeGradient(hexG);
		var gradientB = makeGradient(hexB);
		bbcode.gradientTop = "";
		bbcode.gradientBottom = "";
		for (let i = 39; i >= 0; --i) {
			let color = gradientR[i] + gradientG[i] + gradientB[i];
			bbcode.gradientTop = bbcode.gradientTop + "[color=#" + color + "]▄[/color]";
			bbcode.gradientBottom = bbcode.gradientBottom + "[color=#" + color + "]▀[/color]";
		}
		bbcode.gradientTop = bbcode.gradientTop + "[color=#" + bbcode.color + "]▄[/color]";
		bbcode.gradientBottom = bbcode.gradientBottom + "[color=#" + bbcode.color + "]▀[/color]";
		for (let i = 0; i < 40; ++i) {
			let color = gradientR[i] + gradientG[i] + gradientB[i];
			bbcode.gradientTop = bbcode.gradientTop + "[color=#" + color + "]▄[/color]";
			bbcode.gradientBottom = bbcode.gradientBottom + "[color=#" + color + "]▀[/color]";
		}

		var bbcodeSpacer = "»[/color][color=transparent]▀▀▀▀[/color][color=#" + bbcode.color + "]☙♥❧[/color][color=transparent]▀▀▀▀[/color]";
		if (form.name.value != "") {
			bbcode.name = "[size=9][color=#" + bbcode.color + "]☙♥❧[/color][color=transparent]▀▀▀▀[/color][/size][color=#" + bbcode.color + "][size=24]" + form.name.value + "[/size][/color][size=9][color=transparent]▀▀▀▀[/color][color=#" + bbcode.color + "][size=9]☙♥❧[/color][/size]<br>";
		}
		if (form.imgUrl.value != "") {
			let urlArr = jQuery.map((form.imgUrl.value + "").split(""), function(c){return c;});
			if (urlArr[0] == 'h' && urlArr[1] == 't' && urlArr[2] == 't' && urlArr[3] == 'p' && (urlArr[4] == ':' || (urlArr[4] == 's' && urlArr[5] == ':'))) {
				bbcode.imgUrl = "[img]" + form.imgUrl.value + "[/img]<br><br>";
			} else {
				bbcode.imgUrl = "[img]https://" + form.imgUrl.value + "[/img]<br><br>";
			}
		}
		if (form.location.value != "") {
			bbcode.location = "[color=#" + bbcode.color + "]«Location: " + form.location.value + bbcodeSpacer;
		}
		if (form.mood.value != "") {
			bbcode.mood = "[color=#" + bbcode.color + "]«Mood: " + form.mood.value + bbcodeSpacer;
		}
		if (form.condition.value != "") {
			bbcode.condition = "[color=#" + bbcode.color + "]«Condition: " + form.condition.value + bbcodeSpacer;
		}
		if (form.with.value != "") {
			bbcode.with = "[color=#" + bbcode.color + "]«With: " + form.with.value + "»[/color]";
		} else if (bbcode.condition != "") {
			bbcode.condition = "[color=#" + bbcode.color + "]«Condition: " + form.condition.value + "»[/color]";
		} else if (bbcode.mood != "") {
			bbcode.mood = "[color=#" + bbcode.color + "]«Mood: " + form.mood.value + "»[/color]";
		} else if (bbcode.location != "") {
			bbcode.location = "[color=#" + bbcode.color + "]«Location: " + form.location.value + "»[/color]";
		}
		if (form.ooc.value != "") {
			bbcode.ooc = "«OOC Comments: " + form.ooc.value + "»<br>";
		}

		copyPasteCode = "[align=center]" + bbcode.imgUrl +	
			bbcode.name +
			bbcode.gradientTop + "[/align]<br>" +
			bbcode.mainBodyMargin + ":tab: " + mainBodyParagraphs.fullPassage + "<br><br>" +
			"[align=center]" + bbcode.gradientBottom + "<br>" +
			"[size=9]" + bbcode.location + bbcode.mood + bbcode.condition + bbcode.with + "<br><br>" +
			"[spoiler][color=#" + bbcode.color + "]" + bbcode.ooc + 
			"«Credit: Layout built by [b][url=https://www.gaiaonline.com/profiles/vicky-barrett]Vicky Barrett's[/url][/b] post generator (v1.4).»[/color][/size][/spoiler][/align]";
		document.getElementById("copyPasteTxt").innerHTML = copyPasteCode;
	}
}

$(document).on("keyup", function(button) {
	updateBbcode(button);
});
$(".header").on("click", function(button) {
	updateBbcode(button);
});
$(".mainSection").on("click", function(button) {
	updateBbcode(button);
});

$("#postInfo").keypress(function(button) {
	if (button.which == 13) {
		button.preventDefault();
	}
});
$("#btnAddParagraph").click(function() {
	var paraNumber = mainBodyParagraphs.list.length + 1;
	mainBodyParagraphs.list.push("mainBody" + paraNumber);
	$("<textarea placeholder='Paragraph " + paraNumber + "' rows='4' id='mainBody" + paraNumber + "' name='mainBody" + paraNumber + "' class='form-control spacedElement'></textarea>").insertBefore("#modifyMainBody");
});
$("#btnDelParagraph").click(function() {
	var paraNumber = mainBodyParagraphs.list.length;
	if (paraNumber > 1) {
		$("#mainBody" + paraNumber).remove();
		mainBodyParagraphs.list.pop();
	}
});
$("#btnCopyCode").click(function() {
	var successPhrases = [
		"Success!",
		"Done!",
		"Good to go!",
		"Code copied!",
		"Locked and loaded!",
		"All set!",
		"Now get that posted!"
	];
	function replaceSpacing(content) {
		if (content.search("<br>") <= -1) {
			return content;
		} else {
			var contentArr = jQuery.map((content + "").split(""), function(c){return c;});
			var newContent = "";
			contentArr.splice(content.search("<br>"), 4, "\n");
			for (let i = 0; i < contentArr.length; ++i) {
				newContent = newContent + contentArr[i];
			}
			content = newContent;
			return replaceSpacing(content);
		}
	}
	$("<textarea id='tempTxtClipboard'>" + replaceSpacing(copyPasteCode) + "</textarea>").insertAfter("#copyPasteTxt");
	document.getElementById("tempTxtClipboard").select();
	document.execCommand("copy");
	$("#tempTxtClipboard").remove();
	$("#alertCopied").remove();
	$("<div id='alertCopied' class='alert alert-success'><p>" + successPhrases[Math.trunc(Math.random() * 6.9999)] + "</p></div>").insertAfter("#btnCopyCode");
});

updateBbcode({"which":0});