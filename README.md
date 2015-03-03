# newsReader

# downloadArticles.js

To download the news, we created a http node.js server 

-	Connect to server with RSS 
-	Read news using feedParser and get DOM from the HTML article 
-	We use a sleep function to emulate async process to download the images 
-	Write the json file with RSS data and image names 

# News.JS

The user interface (GTK application) 

- Create an Application window in a full screen mode 
- Read the Json file created by the process downloadArticles.js
- Create a stack for the list of news
- Create a method for frontend views
- In order to show the detail of the news we use webViews  
