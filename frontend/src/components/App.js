import React, { Component } from 'react';

import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			states_data: [],
			index_sorting: 0,
			over_all_data: []
		};
	}

	componentWillMount() {
		axios
			.get('https://corona-tracker-gitesh.herokuapp.com/get_tracker_data/')
			.then((response) => {
				this.setState({
					states_data: response.data.slice(0, response.data.length - 2),
					over_all_data: response.data[response.data.length - 1]
				});
			})
			.catch();
	}

	render() {
		const states_data = this.state.states_data;
		const over_all_data = this.state.over_all_data;

		return (
			<div className="row">
				<h2 className="col-md-12 heading">Corona Tracker</h2>
				{over_all_data ? (
					<div className="col-md-12 row">
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-primary">
									<h5 className="card-title">Overall Active</h5>
									<p className="card-text">{over_all_data.active}</p>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-secondary">
									<h5 className="card-title">Overall Positive</h5>
									<p className="card-text">{over_all_data.positive}</p>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-success">
									<h5 className="card-title">Overall Cured</h5>
									<p className="card-text">{over_all_data.cured}</p>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-danger">
									<h5 className="card-title">Overall Death</h5>
									<p className="card-text">{over_all_data.death}</p>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-warning">
									<h5 className="card-title">Overall New Active</h5>
									<p className="card-text">{over_all_data.new_active}</p>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-info">
									<h5 className="card-title">Overall New Positive</h5>
									<p className="card-text">{over_all_data.new_positive}</p>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-warning">
									<h5 className="card-title">Overall New Death</h5>
									<p className="card-text">{over_all_data.new_positive}</p>
								</div>
							</div>
						</div>
						<div className="col-sm-12 col-md-3">
							<div className="card">
								<div className="card-body text-center bg-dark">
									<h5 className="card-title">Overall New Cured</h5>
									<p className="card-text">{over_all_data.new_positive}</p>
								</div>
							</div>
						</div>
					</div>
				) : null}
				<table className="table">
					<thead className="thead-dark">
						<tr>
							<td>State</td>
							<td>Active</td>
							<td>Positive</td>
							<td>Cured</td>
							<td>Death</td>
							<td>New Active</td>
							<td>New Positive</td>
							<td>New Cured</td>
							<td>New Death</td>
							<td>State Code</td>
						</tr>
					</thead>
					<tbody>
						{states_data.map((each) => (
							<tr key={each.state_name}>
								<td>{each.state_name}</td>
								<td>{each.active}</td>
								<td>{each.positive}</td>
								<td>{each.cured}</td>
								<td>{each.death}</td>
								<td>{each.new_active}</td>
								<td>{each.new_positive}</td>
								<td>{each.new_cured}</td>
								<td>{each.new_death}</td>
								<td>{each.state_code}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default App;
