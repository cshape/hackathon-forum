import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class IdeasForm extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      title: '',
      description: '',
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeTitle(event) {
    this.setState({title: event.target.value});
  }

  handleChangeDescription(event) {
    this.setState({description: event.target.value});
  }

	handleSubmit(event) {
    event.preventDefault();
    axios.post('https://mighty-springs-20769.herokuapp.com/api/ideas', {
      name: this.state.title,
      leader: this.state.leader,
      description: this.state.description
    }).then(response => {
      console.log(response, 'idea noted!');
    })
  }

  render() {
    return (
      <div className="container">
          <div className="idea-detail-left-column">
            <div className="card idea-details-card">
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  placeholder="What's your idea?"
                  autofocus="true"
                  className="idea-details-title-input"
                  value= {this.state.title}
                  onChange={this.handleChangeTitle}
                />
                <textarea
                  placeholder="Describe your idea"
                  className="idea-details-description-input"
                  value={this.state.description}
                  onChange={this.handleChangeDescription}
                >
                </textarea>
                <Link to="/ideas" className="button spacing-inline-m" onClick={this.handleSubmit}>
                  Save idea
                </Link>
                <Link to="/ideas">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
					<div className="idea-detail-right-column">
						<div className="card team-card">
							<div className="card-title">
								<h1>Team</h1>
								<a>Add team members</a>
							</div>
							<div className="avatar">
								<div className="avatar-picture">
									C
								</div>
								<div className="avatar-info">
									<strong>Cale Shapera</strong><br/>
									<span className="type-small type-subdued">Owner</span>
								</div>
							</div>
						</div>
					</div>
				</div>
    );
  }
}

export default IdeasForm;