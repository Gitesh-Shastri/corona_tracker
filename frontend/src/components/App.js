import React, { Component } from 'react';

import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			states_data: [],
			temp_data: [],
			index_sorting: 0,
			over_all_data: [],
			is_finish_loading: false,
			coumn_name: [
				'state_name',
				'active',
				'active_change',
				'cured_discharged_migrated',
				'cured_discharged_migrated_change',
				'deaths',
				'deaths_change'
			],
			descending: false
		};
		this.sortData = this.sortData.bind(this);
		this.searchData = this.searchData.bind(this);
	}

	componentWillMount() {
		console.log(this.state.is_finish_loading);
		axios
			.get('https://corona-tracker-gitesh.herokuapp.com/get_tracker_data/')
			.then((response) => {
				let data = [];
				response.data.forEach((each) => {
					data.push({
						state_name: each.state_name,
						active: each.new_active,
						active_change: each.new_active - each.active,
						cured_discharged_migrated: each.new_cured,
						cured_discharged_migrated_change: each.new_cured - each.cured,
						deaths: each.new_death,
						deaths_change: each.new_death - each.death
					});
				});
				this.setState({
					is_finish_loading: true,
					states_data: data.slice(0, data.length - 2),
					temp_data: data.slice(0, data.length - 2),
					over_all_data: data[data.length - 1]
				});
			})
			.catch(
				this.setState({
					is_finish_loading: true
				})
			);
	}

	sortData(index) {
		let temp_data = this.state.temp_data;
		let coumn_name = this.state.coumn_name;
		let descending = this.state.descending;
		let index_sorting = this.state.index_sorting;
		if (index_sorting !== index) {
			descending = false;
		}
		if (descending) {
			temp_data.sort(function(a, b) {
				if (a[coumn_name[index]] < b[coumn_name[index]]) return -1;
				return a[coumn_name[index]] > b[coumn_name[index]] ? 1 : 0;
			});
		} else {
			temp_data.sort(function(a, b) {
				if (a[coumn_name[index]] > b[coumn_name[index]]) return -1;
				return a[coumn_name[index]] < b[coumn_name[index]] ? 1 : 0;
			});
		}
		this.setState({ temp_data: temp_data, descending: !descending, index_sorting: index });
	}

	searchData(event) {
		let value = event.target.value;
		let states_data = this.state.states_data;
		let temp_data = [];
		states_data.forEach((each) => {
			if (each.state_name.trim().toLowerCase().indexOf(value.trim().toLowerCase()) !== -1) {
				temp_data.push(each);
			}
		});
		this.setState({ temp_data: temp_data });
	}

	render() {
		const states_data = this.state.temp_data;
		const over_all_data = this.state.over_all_data;
		const index_sorting = this.state.index_sorting;
		const is_finish_loading = this.state.is_finish_loading;

		let arrow = <i className="fa fa-arrow-up" aria-hidden="true" />;
		let arrow_dim = (
			<span>
				<i className="fa fa-arrow-up color_grey" aria-hidden="true" />
				<i className="fa fa-arrow-down color_grey" aria-hidden="true" />
			</span>
		);
		if (this.state.descending) {
			arrow = <i className="fa fa-arrow-down" aria-hidden="true" />;
		}

		return (
			<div className="row">
				<h2 className="col-md-12 heading">COVID-19 Tracker</h2>
				{over_all_data ? (
					<div className="col-md-12 row margin_0 padding_0">
						<div className="col-6 col-md-3 padding_0">
							<div className="card">
								<div className="card-body text-center bg-primary">
									<h5 className="card-title">Total Active</h5>
									<p className="card-text">{over_all_data.active}</p>
								</div>
							</div>
						</div>
						<div className="col-6 col-md-3 padding_0">
							<div className="card">
								<div className="card-body text-center bg-warning">
									<h5 className="card-title">Total Active Change since yesterday</h5>
									<p className="card-text">{over_all_data.active_change}</p>
								</div>
							</div>
						</div>
						<div className="col-6 col-md-3 padding_0">
							<div className="card">
								<div className="card-body text-center bg-success">
									<h5 className="card-title">Total Cured/Discharged/Migrated*</h5>
									<p className="card-text">{over_all_data.cured_discharged_migrated}</p>
								</div>
							</div>
						</div>
						<div className="col-6 col-md-3 padding_0">
							<div className="card">
								<div className="card-body text-center bg-danger">
									<h5 className="card-title">
										Total Cured/Discharged/Migrated* Change since yesterday
									</h5>
									<p className="card-text">{over_all_data.cured_discharged_migrated_change}</p>
								</div>
							</div>
						</div>
						<div className="col-6 col-md-3 padding_0">
							<div className="card">
								<div className="card-body text-center bg-info">
									<h5 className="card-title">Total Deaths**</h5>
									<p className="card-text">{over_all_data.deaths}</p>
								</div>
							</div>
						</div>
						<div className="col-6 col-md-3 padding_0">
							<div className="card">
								<div className="card-body text-center bg-dark">
									<h5 className="card-title">Total Deaths** Change since yesterday</h5>
									<p className="card-text">{over_all_data.deaths_change}</p>
								</div>
							</div>
						</div>
					</div>
				) : null}
				<div className="col-md-12">
					Search State <input onChange={(event) => this.searchData(event)} />
				</div>
				<table className="table table-hover">
					<thead>
						<tr>
							<th rowSpan="2" onClick={() => this.sortData(0)}>
								{index_sorting === 0 ? arrow : arrow_dim}
								<strong>Name of State / UT</strong>
							</th>
							<th colSpan="3">
								<strong>Active Cases*</strong>
							</th>

							<th colSpan="3">
								<strong>Cured/Discharged/Migrated*</strong>
							</th>
							<th colSpan="3">
								<strong>Deaths**</strong>
							</th>
						</tr>
						<tr>
							<td onClick={() => this.sortData(1)}>
								{index_sorting === 1 ? arrow : arrow_dim}
								<br /> Total
							</td>
							<td onClick={() => this.sortData(2)} colSpan="2">
								{index_sorting === 2 ? arrow : arrow_dim}
								<br />Change since yesterday
							</td>
							<td onClick={() => this.sortData(3)}>
								{index_sorting === 3 ? arrow : arrow_dim}
								<br />Cumulative
							</td>
							<td onClick={() => this.sortData(4)} colSpan="2">
								{index_sorting === 4 ? arrow : arrow_dim}
								<br />Change since yesterday
							</td>
							<td onClick={() => this.sortData(5)}>
								{index_sorting === 5 ? arrow : arrow_dim}
								<br /> Cumulative
							</td>
							<td onClick={() => this.sortData(6)} colSpan="2">
								{index_sorting === 6 ? arrow : arrow_dim}
								<br />Change since yesterday
							</td>
						</tr>
					</thead>
					<tbody>
						{states_data.length === 0 ? (
							<tr>
								<td colSpan="10" className="heading">
									No Data Found{' '}
								</td>
							</tr>
						) : null}
						{is_finish_loading ? null : (
							<tr>
								<td colSpan="10" className="heading">
									Loading Data .... {' '}
								</td>
							</tr>
						)}
						{states_data.map((each) => (
							<tr key={each.state_name}>
								<td>{each.state_name}</td>
								<td>{each.active}</td>
								<td colSpan="2">
									{each.active_change >= 0 ? (
										<span className="green">
											{' '}
											{each.active_change} <i className="fa fa-arrow-up" />
										</span>
									) : (
										<span className="red">
											{' '}
											{each.active_change} <i className="fa fa-arrow-down" />
										</span>
									)}
								</td>
								<td>{each.cured_discharged_migrated}</td>
								<td colSpan="2">
									{each.cured_discharged_migrated_change >= 0 ? (
										<span className="green">
											{' '}
											{each.cured_discharged_migrated_change} <i className="fa fa-arrow-up" />
										</span>
									) : (
										<span className="red">
											{' '}
											{each.cured_discharged_migrated_change} <i className="fa fa-arrow-down" />
										</span>
									)}
								</td>
								<td>{each.deaths}</td>
								<td colSpan="2">
									{each.deaths_change >= 0 ? (
										<span className="green">
											{' '}
											{each.deaths_change} <i className="fa fa-arrow-up" />
										</span>
									) : (
										<span className="red">
											{' '}
											{each.deaths_change} <i className="fa fa-arrow-down" />
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default App;
