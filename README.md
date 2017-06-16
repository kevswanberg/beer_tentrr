# beer_tentrr
Track beers

# Requirements

In requirements.txt

Install py running `pip install -r requirements.txt` in a virtual environment


# Loading data

Data is being loaded with a management command. Run `python manage.py upload_posts` to populate the database

# What is done.

The admin portion is completed, the post bodys don't really look all that nice but they are there.

The homepage is the entry point for searching enter the term there and then you are sent to a search results page.

The search results page is rendered with React. It loads a small JS file that parses the query parameter from the page. It uses that parameter
to request the data from the api. When the request finishes it displays the result.

The request for search is just doing an icontains lookup on the title and body of the post. The client checks for the first occurance of
the search term for creating the snippet it comes from.

Upvote + Downvote is available on the API

The search results are now sorted by score. Searching an empty string returns all posts. You can go into the post detail to vote the post up/down

# Missing

Pagination, the body snippets contain HTML tags, would preferably be snipped out.

The way I'm using channels is okay but not that great here. Since channels can occasionally miss messages if a message is missed the count won't ever be correct.
Could avoid this by sending the actual post score along with a timestamp so the app can recover if it missed a message.

Didn't get around to adjusting view_count on the posts as well. It would be similar to how upvoting/downvoting work though.

Should include upvote/downvote buttons in the results view rather than just the detail view