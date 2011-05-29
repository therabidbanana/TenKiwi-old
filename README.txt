TenKiwi: http://www.tenkiwi.com/

TenKiwi is a client-side wiki. It is small, around 10kb in size not counting external libraries (a ten kilo wiki - ten ki wi) and contained within a single html file - though Typekit is used for prettier fonts when available. It has support for basic formatting, including: **bold**, _italics_, `code`, and links both [[Internal]] or "external":http://google.com. The header and footer are editable by directly accessing them: http://www.tenkiwi.com/#kiwi-header and http://www.tenkiwi.com/#kiwi-footer. 

For extra fun, the wiki can be set up to synchronize with a database by setting the "Save Url" and "Load Url" options in the #kiwi-settings page. This PHP script can be used to handle those requests, though it's still a little rough around the edges:
http://gist.github.com/507592

TenKiwi should work in modern browsers with HTML5 support. IE9 support for TenKiwi has not been as thoroughly tested, since I don't have a newer Windows machine - but Webkit 5 (Chrome+Safari) and Firefox 3.6 work great. 