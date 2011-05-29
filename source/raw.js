// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level QUIET
// @externs_url http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js
// ==/ClosureCompiler==

// Initial page set. Used as a last resort before assumming an empty page. 
var pages={
	"#Home": [
		{"What's TenKiwi?":"<p>TenKiwi is your very own javascript powered wiki.</p>"},
		{"What can it do?":"<p>You can create as many pages as you'd like, and fill them with whatever \"content\":[[Formatting]] suits your fancy. All of your changes are saved locally, acting like your very own private wiki that doesn't require any extra software to run. Use it to store notes, links or whatever else might suit your fancy.</p>"}
	],
	"#Credits":[
		{"Who's Responsible?":"<p>TenKiwi was coded by \"David Haslem\":http://davidhaslem.com, who works at \"Orange Sparkle Ball\":http://osb.co.</p>"}
	],
	"#Formatting":[
		{"Content Formatting":"<p>Content Formatting is easy in **TenKiwi** - `just try editing` _this page_ to see. You can link back to a page, like the [[Home]] page, or to an external site like \"Google\":http://www.google.com, or link to \"a page with special link text\":[[Home]].</p>"}
	],
	"#kiwi-header":[
		{"TenKiwi":"<nav><ul><li>[[Home]]</li><li>[[Credits]]</li></ul></nav>"}
	],
	"#kiwi-footer":[{"All Pages":"%%pagelist%%"}],
	"#kiwi-settings":[{"Save Url":"", "Load Url":""}]
};
var pagelist = ["#Home","#Credits","#Formatting"];

$(function(){
	var hash = location.hash; 
	hash = (hash ? hash:'#Home');
  if(location.hash != hash){ location  = hash};
	// Format buttons
	$.each({
		'Bulleted List': function(){
			document.execCommand('InsertUnorderedList',null,false)
		},
		'Numbered List': function(){
			document.execCommand('InsertOrderedList',null,false)
		}
	 }, function(i,a){ 
		$('#b1').append($('<button class="blue">'+i+'</button>').click(a))
	});
	
	// Links and formatting buttons
	$('button.edit_on').click(edit_on);
	$('button.edit_off').click(function(){edit_off(true)});
	$('button.edit_cancel').click(function(){if(confirm('Are you sure?')) edit_off(false)});
	$('button.add_section').click(function(){new_s();edit_on()});
	$('.container a').live('click', link); 
	$('article button.red').live('click', remove_s); 
	$('article button.blue').live('click', function(){ raw($(this),false) });
	
	// Load first page and trigger load on hash changes
	$(window).bind('hashchange', function(){ doload(location.hash)}); 
	doload(hash);
});

// Function called whenever a link is clicked. 
// Causes external links to open in new window and 
// offers save if internal link clicked.
function link(){
	var href = $(this).attr('href');
	if(href.search(/^http:/)===-1){
		if($('body').hasClass('go')) 
		  confirm('Save changes first?') ? edit_off(true) : edit_off(false); 
		window.location = href;
	}
	else {
	  this.target='_blank';
	  return true
	}
}

// Function for viewing/editing the content as raw html in textarea.
// Called with a jQuery selector representing the raw button and 
// a "force_off" option to force the raw edit to go to off regardless
// of current toggle.
function raw(selector,force_off){
	var is_on, raw;
	selector=selector.parent().children('section.q:first'); 
	is_on=selector.data('on') ? true:false;
	// Turn the raw off if it's already on, or if we're forcing it off (page edit closing)
	if(force_off || is_on){ 
	  if(is_on){
	    raw=selector.children('textarea').val();
	    selector.empty().html(raw);
	    is_on=false;
	  }
	  selector.attr('contenteditable',true);
	}
	else{ 
	  selector.attr('contenteditable',false); 
	  is_on=true; 
	  // Wrap current content in a textarea - does jquery clean it?
	  selector.html('<textarea>'+selector.html()+'</textarea>');
	} 
	// Set toggle value so next call will turn it off/on
	selector.data('on',is_on);
}

// Formats a given string with our minimal formatting capability, and replaces 
// certain variables
function magic_str(my_str){
	my_str=my_str.replace(/%%pagelist%%/g, 
	  "<ul>" +
	  $.map(pagelist, function(x){ return "<li>[["+x.substr(1)+"]]</li>"}).join('\n') +
	  "</ul>");
	my_str = my_str.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
	my_str = my_str.replace(/\b_([^_]+?)_\b/g, '<em>$1</em>');
	my_str = my_str.replace(/\[\[([^"]+?)\]\]/g, '<a href="#$1">$1</a>');
	my_str = my_str.replace(/`([^`]+?)`/g, '<code>$1</code>');
	my_str = my_str.replace(/([\s\(\>])(https?:\/\/([^\s"<]+))([\s\)\<]*)/g, '$1<a href="$2">$2</a>$4');
	my_str = my_str.replace(/"([^"]+?)":(https?:\/\/[^\s"<]+)/g, '<a href="$2">$1</a>');
	my_str = my_str.replace(/<a href="([^"]+?)([,\.\?])">(.+?)<\/a>/g, '<a href="$1">$3</a>$2');
	my_str = my_str.replace(/"([^"]+?)":<a href="([^"]+?)">(.+?)<\/a>/g, '<a href="$2">$1</a>');
	return my_str;
}


// Undo magic function (uses jquery data to restore unaltered html)
$.fn.unmagic = function(){
  return this.html(this.data('m'));
}

// Store html for later unmagic
$.fn.m_store = function(){
  return this.data("m",this.html());
}

// Apply magic function to selector
$.fn.magic = function(){
  return this.m_store().html(magic_str(this.html())).break_links();
}

// "Break" links if applicable (style as broken)
$.fn.break_links = function(){
  $('a',this).each(function(){
    x=$(this).attr('href');
    if(x.match(/^#/)) $.inArray(x,pagelist)===-1 ? $(this).addClass('broken') : $(this).removeClass('broken');
  }); 
  return this;
}

// Pull a value from the kiwi-settings page
function settings(for_key){
	var page = '#kiwi-settings', settings={};
	page= localStorage.getItem(page) ? localStorage.getItem(page) :  JSON.stringify(pages[page]);
	$.each(JSON.parse(page), function(i,x){
	  $.each(x, function(key,val){settings[key] = val});
	});
	return for_key ? settings[for_key] : settings;
}

// Save a value to localStorage, and to the external storage if available
function storage_save(key, val, save){
  val=JSON.stringify(val);
  localStorage.setItem(key,val);
  if(save && settings('Save Url').match(/https?:\/\/(.+?)/))
    $.post(settings('Save Url'),{'title':key,'content':val});
}

// Storage Load
function storage_load(key){
  return JSON.parse(localStorage.getItem(key));
}

// Only push if value not already in array
Array.prototype.push_uniq = function(val){
  if($.inArray(val,this)===-1) this.push(val);
}

$.fn.page_save = function(){
  var page_data, page_name = "#";
  page_name += this.attr('id');
  page_data = this.children('section').map(function(i,d){
    i={};
    i[$(d).children('h1').text()] = $(d).children('section').html();
    return i;
  }).get();
  
  storage_save(page_name,page_data,true);
  storage_save('pagelist',pagelist.push_uniq(page_name),false);
  
  this.magic();
}

$.fn.page_load = function(page_name){
  
}

function doload(a){
	var b=storage_load('pagelist');
	pagelist=b?b:pagelist;
	myload('#kiwi-header','header.x');
	myload(a,'article.x');
	myload('#kiwi-footer','footer.x')
}

function realload(a,b){
	var c = localStorage.getItem(a), d="";
	b=$(b);
	if(!c){
	  c=pages[a]? pages[a]: JSON.parse("[{\""+a.substr(1)+"\":\"<p>This is a new page</p>\"}]")
	}
	else c=JSON.parse(c);
	b.empty();
	$.each(c,function(i,x){
	  $.each(x,function(j,y){
	    d+=('<section class="clear"><header class="q"><h1>'+j+'</h1></header><section class="q">'+y+'</section></section>')
	  });
	});
	b.html(d);
	b.magic();
	b.attr('id',a.substr(1));
}
	
function myload(a,b){
	if(settings('Load Url').match(/https?:\/\/(.+?)/)){
	  $.get(settings('Load Url'), {'title':a,'b':b}, function(d){
	    if(!d.error){
	      localStorage.setItem(d.title, d.content);
	    }
	    realload(d.title, d.b);
	  }, 'json'); 
	}
	else realload(a,b);
}

function edit_on(){
	$('body').addClass('go');
	$('article.x').unmagic();
	$('article .q').attr('contenteditable', true);
	$('article .red,article .blue').remove();
	$('article header.q').before('<button class="red">Remove</button><button class="blue">Raw</button>');
}

function edit_off(a){
	$('article .blue').each(function(i,x){raw($(x),true);});
	$('body').removeClass('go');
	$('article .q').attr('contenteditable', false);
	$('article .red, article .blue').remove();
	if(a) $('article.x').page_save(); 
	else doload(location.hash);
}

function remove_s(){
  $(this).closest('section').remove(); 
  $('article.x').m_store();
}

function new_s(){ 
  $('article.x').append('<section><header class="q"><h1>New</h1></header><section class="q"><p>New content</p></section></section>'); 
  $('article.x').m_store();
}
