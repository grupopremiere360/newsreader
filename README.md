# newsReader

# downloadArticles.js

For download news, we create a http node.js server. 
-	Connect server with RSS 
-	Read news using feedParser and get DOM form the HTML article 
-	Download images  and using sleep function, emulate async process 
-	Write the json file with RSS data and image names 

# News.JS

The interface GTK application 

- We create an Application window in full screen mode 
- Read the Json file created by for the process downloadArticles.js
- Create a stack for the list news
- Create a method for frontend view, the news detail show using a webViews 
