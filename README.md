# newsReader

# downloadArticles.js

To download the news, we created a http node.js server. 
-	Connect the server with RSS 
-	Read news using feedParser and get DOM from the HTML article 
-	Download the images and we use a sleep function to emulate async process 
-	Write the json file with RSS data and image names 

# News.JS

The interface GTK application 

- We create an Application window in full screen mode 
- Read the Json file created by the process downloadArticles.js
- Create a stack for the list news
- Create a method for frontend view, the news detail we show them using webViews 
