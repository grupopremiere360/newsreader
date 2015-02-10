//Includes libs
var feedparser = require('ortoo-feedparser');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var http = require('http');
var arrayData = [];
var countArticles = 0;
var countGetDom = 0;
var urlRss = 'http://panoramanoticias.com/?feed=rss2';


http.createServer(function (req, res){
	res.writeHead(200, {'Content-Type':'text/plain'});
	readFeed(urlRss);
	res.end('Grupo premiere 360.');
}).listen(1337, '127.0.0.1');

console.log('Server prototype running at http://127.0.0.1:1337/');

function readFeed(url){
	feedparser.parseUrl(url).on('article', function(article){
		var DomDom = getDom(article);
		sleep(5000);
		countArticles++;
	});
}

function sleep(milliseconds){
	var start = new Date().getTime();
	for(var i = 0 ; i < 1e7; i++ ){
		if((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

function writeJsonFile(){
	var outputFilename = '/home/gp360/Desktop/app-gtk/my.json';
	fs.writeFile(outputFilename, JSON.stringify(arrayData, null, 4), function(err){});
}

function getDom (article){
		
		var opts = {
			url : article.link,
			strictSLS:false,
			rejectUnauthorized: false,
			agent:false,
			metohod:'GET'
		};
	   
	   request(opts,function(err, response, body){
				var $ = cheerio.load(body);

				var img = $('.content article .single-post-thumb img').attr('src');
				var nombre = getNameImage(img);
				var notice = $('.content article .post-inner .entry').html();				
				    notice = notice.replace(/href=/g, 'url-tag=');
									
				var myData = {
					title:article.title,
					link:article.link,
					publication:article.pubDate,
					description:article.description,
					content: notice,
					content_image : nombre
				}
				arrayData.push(myData);	
				countGetDom++;
				
				if (countGetDom == countArticles){
					writeJsonFile();
				}
				
				request(img).pipe(fs.createWriteStream('/home/gp360/Desktop/app-gtk/img/'+nombre));	

		});
}

function getNameImage(src){
	var arraySplit = src.split('/');
	var positionName = arraySplit.length;
	return arraySplit[positionName - 1];
}
