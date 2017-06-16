var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;


var socket = new WebSocket("ws://" + window.location.host + "/updates/");
var socketListener = []
socket.onmessage = function(e) {
  socketListener.forEach(function(listener){
    if (e.data.startsWith("{"))
        listener(JSON.parse(e.data));
  });
};

class ReviewSnippet extends React.Component{
  findFirstRelevantPortion(){
    var index = this.props.review.body.indexOf(this.props.term);
    if (index == -1)
      return this.props.review.body.substring(0,100);
    else
      return this.props.review.body.substring(index-50, index+50);
  }

  render(){
    return(
      <tr>
        <td>
          <Link to={`/posts/${this.props.review.id}`}>{ this.props.review.title || "No Title" }</Link>
        </td>
        <td>
          { this.findFirstRelevantPortion() }
        </td>
        <td>
          { this.props.review.score }
        </td>
      </tr>
    )
  }
}

class SearchResults extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      reviews: [],
      q: getQueryParam('q')
    }

    this.event = this.event.bind(this);
  }

  sortReviews(reviews){
    return reviews.sort(function(r1, r2){
      if (r1.score == r2.score)
        return r2.id - r1.id;
      return r2.score - r1.score;
    });
  };

  event(e){
    var review = this.state.reviews.find(function(review){
      return review.id == e.id;
    })
    review.score = review.score + e.change;
    const reviews = this.sortReviews(this.state.reviews);
    this.setState({ reviews });
  }

  componentDidMount(){
    axios.get(`/api/posts/?q=${this.state.q||''}`)
      .then(res => {
        const reviews = this.sortReviews(res.data);
        this.setState({ reviews });
      });
    socketListener.push(this.event);
  }

  componentWillUnmount(){
    var self=this;
    socketListener = socketListener.filter(function(listener){
      return listener !== self.event;
    });
  };

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>
              Title
            </th>
            <th>
              Body
            </th>
            <th>
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.reviews.map(review =>
          <ReviewSnippet key={review.id} review={review} term={this.props.q}/>)}
      </tbody>
        </table>
    )
  };
};

class SearchBar extends React.Component {
  render(){
    return (
      <div>
        <h1>
          Find some beer
        </h1>
        <form action="/posts/">
          <input type="text" name="q">
          </input>
          <input type="submit" value="Search">
          </input>
        </form>
      </div>
    )
  };
};

class ReviewDetail extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      review: {}
    };

    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.event = this.event.bind(this);
  }

  event(e){
    if(this.state.review.id == e.id){
      const review = this.state.review;
      review.score = review.score + e.change;
      this.setState({ review });
    }
  };

  componentDidMount(){
    axios.get(`/api/posts/${this.props.params.id}/`)
      .then(res => {
        const review = res.data;
        this.setState({ review });
      });
    socketListener.push(this.event);
  };

  componentWillUnmount(){
    var self=this;
    socketListener = socketListener.filter(function(listener){
      return listener !== self.event;
    });
  };

  upvote(){
    axios.post(`/api/posts/${this.state.review.id}/upvote/`)
  };

  downvote(){
    axios.post(`/api/posts/${this.state.review.id}/downvote/`)
  };

  render(){
    return(
      <div>
        <button onClick={this.upvote}>Up</button>
        Score: { this.state.review.score }
        <button onClick={this.downvote}>Down</button>
        <h1>
          { this.state.review.title || "No Title" }
        </h1>
        <div dangerouslySetInnerHTML={{ __html: this.state.review.body }}>
        </div>
      </div>
    )
  }
}

function getQueryParam(paramName){
  var params = {};
  window.location.search.substr(1).split('&').forEach(function(param){
    param = param.split("=")
    params[param[0]] = param[1]
  })
  return params[paramName];
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={SearchBar}/>
    <Route path="/posts/" component={SearchResults} />
    <Route path="/posts/:id" component={ReviewDetail} />
  </Router>,
document.getElementById('root'))
