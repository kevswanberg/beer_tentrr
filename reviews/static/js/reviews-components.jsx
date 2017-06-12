class Review extends React.Component{
  findFirstRelevantPortion(){
    var index = this.props.body.indexOf(this.props.term);
    if (index == -1)
      return this.props.body.substring(0,100);
    else
      return this.props.body.substring(index-50, index+50);
  }

  render(){
    return(
      <tr>
        <td>
          { this.props.title || "No Title" }
        </td>
        <td>
          { this.findFirstRelevantPortion() }
        </td>
        <td>
          { this.props.score }
        </td>
      </tr>
    )
  }
}

class SearchResults extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      reviews: []
    }
  }

  componentDidMount(){
    axios.get(`/api/posts?q=${this.props.q}`)
      .then(res => {
        const reviews = res.data;
        this.setState({ reviews });
      })

  }

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
          <Review key={review.id} title={review.title} body={review.body} score={review.score} term={this.props.q}/>)}
      </tbody>
        </table>
    );
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
  <SearchResults q={getQueryParam('q')} />,
  document.getElementById('root')
)
