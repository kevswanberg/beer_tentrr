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

# Missing
The results aren't set up to be paginated, if I had more time they would be.

Upvoting and downvoting aren't yet on the front end.

The score page doesn't exist yet. It would have looked similar to the results page. I would have used a websocket connection on the front end, tied it
to the django backend making use of django-channels project. In the upvote/downvote routes on the API there would be calls to send events when the
votes occur
