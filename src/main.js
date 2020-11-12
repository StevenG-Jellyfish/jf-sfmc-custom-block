require('../node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css');

var SDK = require('blocksdk');

// 3rd argument true bypassing https requirement: not prod worthy
var sdk = new SDK(null, null, true); 

var address, width, height, zoom, link, mapsKey;

var jf_title, jf_body_content, jf_CTA_copy, jf_CTA_target_link, jf_CTA_target_link_type;

function debounce (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function paintSettings () {
	document.getElementById('text-input-id-0').value 		= jf_title;
	document.getElementById('textarea-input-id-0').value 	= jf_body_content;
	document.getElementById('text-input-id-1').value 		= jf_CTA_copy;
	document.getElementById('text-input-id-2').value 		= jf_CTA_target_link;
	getRadioValues();
}

function getRadioValues () {
	var ele = document.getElementsByName('cta-link-display');               
	for(i = 0; i < ele.length; i++) { 
		if(ele[i].value == jf_CTA_target_link_type) { 
			ele[i].checked = true;
		}
	} 
	//paintRadioValues();
}
function paintRadioValues () {
	var ele = document.getElementsByName('cta-link-display');   
	var lnkType = "link"; // defaults to link           
	for(i = 0; i < ele.length; i++) { 
		if(ele[i].checked) { 
			lnkType = ele[i].value;
		}
	} 
	return lnkType;
}

function paintContent() {
	jf_title 				= document.getElementById('text-input-id-0').value;
	jf_body_content 		= document.getElementById('textarea-input-id-0').value;
	jf_CTA_copy 			= document.getElementById('text-input-id-1').value;
	jf_CTA_target_link 		= document.getElementById('text-input-id-2').value;
	jf_CTA_target_link_type	= paintRadioValues();

//HTML OUTPUT HERE
	var returnContent = '';
		
		returnContent += (jf_title !='')?'<h2>' + jf_title + '</h2>':'';
		returnContent += (jf_body_content !='')?'<p>' + jf_body_content + '</p>':'';
		returnContent += ((jf_CTA_target_link !='') && (jf_CTA_copy !=''))?'<a href="' + jf_CTA_target_link + '" class="' + jf_CTA_target_link_type + '">'+ jf_CTA_copy + '</a>':'';
//HTML OUTPUT HERE

	sdk.setContent(returnContent);
	sdk.setData({
		jf_title: 					jf_title,
		jf_body_content: 			jf_body_content,
		jf_CTA_copy: 				jf_CTA_copy,
		jf_CTA_target_link: 		jf_CTA_target_link,
		jf_CTA_target_link_type: 	jf_CTA_target_link_type
	});
}

sdk.getData(function (data) {
	jf_title 					= data.jf_title || '';
	jf_body_content 			= data.jf_body_content || '';
	jf_CTA_copy 				= data.jf_CTA_copy || '';
	jf_CTA_target_link 			= data.jf_CTA_target_link || '';
	jf_CTA_target_link_type 	= data.jf_CTA_target_link_type || '';
	paintSettings();
	paintRadioValues();
	paintContent();
});

document.getElementById('radio-input-id-1').addEventListener("click", getRadioValues());
document.getElementById('radio-input-id-2').addEventListener("click", getRadioValues());

document.getElementById('workspace').addEventListener("input", function () {
	debounce(paintContent, 500)();
	paintRadioValues();
});
