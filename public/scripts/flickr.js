var SearchPage = React.createClass({
                render: function() {
                    return (
                    <div>
                        <SearchBar />
                        {this.props.children}
                    </div>
                    );
                }
            });

            var SearchBar = React.createClass({
                render: function() {
                    return (
                    <div className="search-bar">
                        <ReactRouterForm to={"/search"} className="row">
                            <div className="input-group col-xs-10 col-xs-offset-1">
                                <input type="text" name="query" className="form-control" placeholder="e.g. Cat pictures" />
                                <span className="input-group-btn">
                                    <button className="btn btn-default bnt-lg">Search</button>
                                </span>
                            </div>
                        </ReactRouterForm>
                    </div>
                    );
                }
            });

            var ViewImage = React.createClass({
                render: function() {
                    return (
                    <div className="imgView">
                        <img src={decodeURIComponent(this.props.params.url)} />
                    </div>
                    );
                }
            });

            var ResultsGrid = React.createClass({
                getInitialState: function() {
                    return {imgUrls: []};
                },

                componentWillReceiveProps: function(nextProps) {
                    this.performSearch(nextProps.params.query);
                },

                componentDidMount: function() {
                    this.performSearch(this.props.params.query);
                    
                },

                performSearch: function(query) {
                    $.get({
                        url: "https://api.flickr.com/services/rest",
                        dataType: "json",
                        data: {
                            method: "flickr.photos.search",
                            api_key: "97050963a787fcdb7253e0396a712dc9",
                            secret: "15346127da4a2996",
                            format: "json",
                            nojsoncallback: 1,
                            per_page: 12,
                            text: query,
                            authenticated: true,
                            //user_id: 'mgcavero03'
                        },




                        success: function(data) {
                            if (data.photos) {
                                var urls = data.photos.photo.map(function(photo) {
                                  // var url = "https://farm" + photo.farm + ".staticflickr.com/";
                                   // url += photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
                                    var url="https://c8.staticflickr.com/9/8440/28654610423_8b44f8dca0_m.jpg";

                                    
                                    return url;
                                });

                                this.setState({imgUrls: urls});
                            }
                            else {
                                this.setState({imgUrls: []});
                            }
                        }.bind(this)
                    });
                },

                render: function() {
                    var perRow = 3;
                    var rows = [];

                    var urls = this.state.imgUrls;

                    for (var i = 0; i < urls.length; i += perRow) {
                        rows.push(urls.slice(i, i + perRow));
                    }

                    var imgRows = rows.map(function(row) {
                        return (
                        <tr key={row.reduce(function(a, b) {return a + b})}>
                            {
                                row.map(function(url) {
                                    return <td className="imgCell" key={url}>
                                        <ReactRouter.Link to={"/img/" + encodeURIComponent(url)}>
                                            <img src={url} />
                                        </ReactRouter.Link>
                                    </td>;
                                })
                            }
                        </tr>
                        );
                    });

                    return (
                    <table>
                        <tbody>
                            {imgRows}
                        </tbody>
                    </table>
                    );
                }
            });

            function handleSearch(nextState, replaceState) {
                var q = nextState.location.query.query;
                replaceState(null, "/view/" + q);
            }

            ReactDOM.render((
                <ReactRouter.Router>
                    <ReactRouter.Route path="/" component={SearchPage}>
                        <ReactRouter.Route path="img/:url" component={ViewImage} />
                        <ReactRouter.Route path="search" onEnter={handleSearch}  />
                        <ReactRouter.Route path="view/:query" component={ResultsGrid} />
                    </ReactRouter.Route>
                </ReactRouter.Router>
            ), document.getElementById("flickr"));
