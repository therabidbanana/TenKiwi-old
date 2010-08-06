TenKiwi: http://www.davidhaslem.com/wiki/

TenKiwi is a client-side wiki. It is exactly around 10kb in size (a ten ki[lobyte] wi[ki], ha), and contained within a single html file (excluding jQuery). It has support for basic formatting, including: **bold**, _italics_, `code`, and link both [[Internal]] or "external":http://google.com. The header and footer are editable by directly accessing them: http://davidhaslem.com/wiki/#kiwi-header and http://davidhaslem.com/wiki/#kiwi-footer. 

For extra fun, the wiki can be set up to synchronize with a database by setting the "Save Url" and "Load Url" options in the #kiwi-settings page. This PHP script can be used to handle those requests, though it's still a little rough around the edges:
http://gist.github.com/507592

TenKiwi should work in modern browsers with HTML5 support. IE9 support for TenKiwi has not been as thoroughly tested, since I don't have a newer Windows machine - but Chrome/Safari 5 and Firefox 3.6 both work great. 