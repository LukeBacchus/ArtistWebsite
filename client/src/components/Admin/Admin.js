import React from 'react';
import { getUsers, deleteUser } from '../../actions/user';

class Admin extends React.Component {
  componentDidMount() {
    document.title = 'CAW | Admin';
    getUsers(this);
  }

  state = {
    allUsers: []
  };

  render() {
    if (this.state.allUsers.length) {
      var users = this.state.allUsers.filter((e) => !e.flags.admin);
      var list = users
        .map(function (element) {
          return (
            '<li>' +
            'Username: '.bold().fontcolor('darkmagenta') +
            element.username +
            ' | '.bold().fontcolor('darkorange') +
            'Display Name: '.bold().fontcolor('darkmagenta') +
            element.displayName +
            ' | '.bold().fontcolor('darkorange') +
            ' Id: '.bold().fontcolor('darkmagenta') +
            element._id +
            ' | '.bold().fontcolor('darkorange') +
            ' Signup Date: '.bold().fontcolor('darkmagenta') +
            new Date(element.createdAt).toDateString() +
            ' | '.bold().fontcolor('darkorange') +
            ' Banned/Deleted: '.bold().fontcolor('darkmagenta') +
            element.flags.deleted +
            '</li>'
          );
        })
        .join('');
      document.getElementById('users').innerHTML = list;
      const addForm = document.forms['ban'];
      addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const value = addForm.querySelector('input[type="text"]').value;
        if (value == '') {
          alert('Please enter a username');
        } else if (window.confirm('Are you sure you want to ban ' + value + '?')) {
          deleteUser(value);
          alert('Banned user: ' + value);
        }
      });
    }
    return (
      <div className="admin main container">
        <h2>Users</h2>
        <div id="users"></div>
        <h2>Ban</h2>
        <form id="ban">
          <input type="text" placeholder="Enter a username..." />
          <button>Ban</button>
        </form>
      </div>
    );
  }
}

export default Admin;
