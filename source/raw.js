// Initial page set. Used as a last resort before assumming an empty page. 
var pages={
	"#Home": [
		{"What's TenKiwi?":"<p>TenKiwi is your very own javascript powered wiki.</p>"},
		{"What can it do?":"<p>You can create as many pages as you'd like, and fill them with whatever \"content\":[[Formatting]] suits your fancy. All of your changes are saved locally, acting like your very own private wiki that doesn't require any extra software to run. Use it to store notes, links or whatever else might suit your fancy.</p>"}
	],
	"#Credits":[
		{"Who's Responsible?":"<p>TenKiwi was coded by \"David Haslem\":http://davidhaslem.com.</p>"}
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

$(function(){
	var a = location.hash, p = $('.q'); 
	a = (a ? a:'#Home');
	
	// Format buttons
	$.each({
		'Bulleted List': function(){
			dc.execCommand('InsertUnorderedList',null,false)
		},
		'Numbered List': function(){
			dc.execCommand('InsertOrderedList',null,false)
		}
	 }, function(i,a){ 
		$('#b1').append($('<button class="blue">'+i+'</button>').click(a))
	});
	
	// Links and formatting buttons
	$('.container a').live('click', linked); 
	$('article button.red').live('click', remove_s); 
	$('article button.blue').live('click', function(){ raw($(this),false) });
	
	// Load first page and trigger load on hash changes
	$(window).bind('hashchange', function(){ doload(location.hash)}); 
	doload(a);
});


var js=JSON.stringify,jp=JSON.parse,ls=localStorage,dc=document,pagelist=["#Home","#Credits","#Formatting"];
function linked(){
	var a = $(this),b=a.attr('href');
	if(b.search(/^http:/)===-1){
		if($('body').hasClass('go')) confirm('Save changes first?') ? edit_off(true) : edit_off(false);window.location=b}
	else {this.target='_blank';return true}
}
function raw(b,d){
	var a,c;
	b=b.parent().children('section.q:first'); a=b.data('on') ? true:false
	if(d||a){ if(a){a=b.children('textarea').val();b.empty().html(a);a=false} b.attr('contenteditable',true)}
	else{ b.attr('contenteditable',false); a=true; b.html('<textarea>'+b.html()+'</textarea>')} 
	b.data('on',a)
}
function magic(a){
	a=a.replace(/%%pagelist%%/g, "<ul>"+$.map(pagelist, function(x){ return "<li>[["+x.substr(1)+"]]</li>"}).join('\n')+"</ul>");
	return a.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>').replace(/\b_([^_]+?)_\b/g, '<em>$1</em>').replace(/\[\[([^"]+?)\]\]/g, '<a href="#$1">$1</a>').replace(/`([^`]+?)`/g, '<code>$1</code>').replace(/"([^"]+?)":(https?:\/\/[^\s"<]+)/g, '<a href="$2">$1</a>').replace(/<a href="([^"]+?)([,\.\?])">(.+?)<\/a>/g, '<a href="$1">$3</a>$2').replace(/"([^"]+?)":<a href="([^"]+?)">(.+?)<\/a>/g, '<a href="$2">$1</a>')
}
function unmagic(a){a=a.closest('.x');a.html(a.data("unmagic"))}
function supermagic(a){
	a.data("unmagic",a.html()); a.html(magic(a.html()));
	$('a',a).each(function(i,x){x=$(x); if(x.attr('href').match(/^#/))
		$.inArray(x.attr('href'),pagelist)===-1?x.addClass('broken'):x.removeClass('broken')})
}
function settings(c){
	var a = '#kiwi-settings', b={};
	a= (ls.getItem(a) ? ls.getItem(a) : js(pages[a]));
	$.each(jp(a), function(i,x){$.each(x, function(c,d){b[c]=d})});
	return c?b[c]:b
}
function dosave(a){
	var b=[],c="#";
	a=a.closest('.x');c=c+a.attr('id');
	a.children('section').each(function(i,c){
		b.push("{"+js($(c).children('header').text())+":"+ js($(c).children('section').html())+"}")
	});
	b="["+b.join(',')+"]";ls.setItem(c,b);
	if(settings('Save Url').match(/https?:\/\/(.+?)/)) $.post(settings('Save Url'), {'title':c,'content':b}, function(){}, 'json');
	if($.inArray(c,pagelist) === -1){ pagelist.push(c); ls.setItem('pagelist',js(pagelist))}
	supermagic(a)}
function doload(a){
	var b=jp(ls.getItem('pagelist'));pagelist=b?b:pagelist;
	myload('#kiwi-header','header.x');myload(a,'article.x');myload('#kiwi-footer','footer.x')
}
function realload(a,b){
	var c = ls.getItem(a), d="";b=$(b);
	if(!c){c=pages[a]? pages[a]: jp("[{\""+a.substr(1)+"\":\"<p>This is a new page</p>\"}]")}else c=jp(c);
	b.empty();
	$.each(c,function(i,x){$.each(x,function(j,y){d+=('<section class="clear"><header class="q"><h1>'+j+'</h1></header><section class="q">'+y+'</section></section>')})});
	b.html(d);supermagic(b);b.attr('id',a.substr(1))}
function myload(a,b){
	if(settings('Load Url').match(/https?:\/\/(.+?)/)) $.get(settings('Load Url'), {'title':a,'b':b},function(d){if(!d.error){ls.setItem(d.title,d.content)}realload(d.title,d.b)},'json'); 
	else realload(a,b)}
function edit_on(){
	$('body').addClass('go');unmagic($('article'));$('article .q').attr('contenteditable', true);$('article .red,article .blue').remove();$('article header.q').before('<button class="red">Remove</button><button class="blue">Raw</button>')
}
function edit_off(a){
	$('article .blue').each(function(i,x){raw($(x),true);});$('body').removeClass('go');$('article .q').attr('contenteditable', false);$('article .red, article .blue').remove();
	if(a) dosave($('article')); else doload(location.hash);
}
function remove_s(){ $(this).closest('section').remove(); $('article.x').data("unmagic",$('article.x').html())}
function new_s(){ $('article.x').append('<section><header class="q"><h1>New</h1></header><section class="q"><p>New content</p></section></section>'); $('article.x').data("unmagic",$('article.x').html())}