import React from 'react';
import axios from 'axios';
import Card from '../UI/Card/Card';
import Avatar from '../UI/Avatar/Avatar';
import Parser from 'html-react-parser';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import IdeaComments from './IdeaComments.js';

class IdeasShow extends React.Component {
  result = ''
  constructor(props) {
		super(props);
		this.state = {
      name: '',
      description: '',
      comments: [],
      leader: '',
      members: [],
      currentcomment: ''
    };

    this.id = props.match.params.id;
    this.addTeamMembers = this.addTeamMembers.bind(this);
    this.commentSubmit = this.commentSubmit.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

handleChangeComment(value) {
    this.setState({ currentcomment: value });
  }
 



handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    let url = `http://localhost:3001/api/idea/${this.id}`
    var commentObject = {
      'author': this.props.user.fullName,
      'text': this.state.currentcomment,
      'date': Date.now()
    }



     this.setState({
      comments: [...this.state.comments, commentObject]
    }, () => {
      console.log(this.state.comments);
      axios.put(url, {
        comments: this.state.comments
      }).then(response => {
      console.log(response, 'comment added');
      this.setState({ currentcomment: ''})
      console.log(this.state.comments);
      this.forceUpdate();
    });
  });


     
  }

  addTeamMembers() {
    var newMember = prompt("Enter the name of the new team member");
    var newRole = prompt("What will their role be?");
    console.log(newMember);
    console.log(newRole);
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/idea/'+ this.id)
      .then(response => response.json())
      .then(data => this.setState({
        name: data.name,
        description: data.description,
        members: data.members,
        leader: data.leader,
        comments: data.comments
       }, () => {
        console.log(this.state);
       })); 
  }

  commentSubmit() {
    alert("write function to submit a comment to the db.");
  }




  render() {   

    return (
      



      <div className="container">
          <div className="idea-detail-left-column">
            <Card>
              <div className="idea-details-title-input">
                {this.state.name}
              </div>
              <div className="idea-details-description-input">
                {Parser(`${this.state.description}`)}
              </div>
            </Card>
          </div>

          <div className="idea-detail-right-column">
            <Card title="Team" links={[{content: 'Add team members', onAction: this.addTeamMembers}]}>
              <Avatar></Avatar>
              <Avatar
                initials="C"
                textLabel="Cale Shapera"
                textStyle="bold"
                subTextLabel="Owner"
                backgroundColor="#FBB134"
              >
              </Avatar>
              <Avatar
                initials="G"
                textLabel="Geoff Thierman"
                textStyle="bold"
                subTextLabel="Designer"
                backgroundColor="#B264E7"
                spacing="none"
              >
              </Avatar>
            </Card>
          </div>
            <div className="idea-detail-right-column">
            <Card title="Comments">
             <ReactQuill
                  placeholder="Add a comment"
                  className="idea-details-description-input"
                  value={this.state.currentcomment}
                  onChange={this.handleChangeComment}
                >
                </ReactQuill>
                <button className="button" onClick={this.handleSubmit}>
                  Post comment
                </button>
             <IdeaComments id={this.id} comments={this.state.comments} />
          
             
              
            </Card>
          </div>
        </div>


      
    );
  }
}

export default IdeasShow;
