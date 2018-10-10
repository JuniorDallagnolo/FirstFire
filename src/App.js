import React, { Component } from "react";
import "./App.css";
import firebase from "./firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      phone: "",
      contacts: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(ev) {
    this.setState({
      [ev.target.name]: ev.target.value
    });
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const contacts = firebase.database().ref("Contacts");
    const contact = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone
    };
    contacts.push(contact);
    this.setState({ name: "", email: "", phone: "" });
  }

  removeItem(itemId) {
    const list = firebase.database().ref(`/contacts/${itemId}`);
    list.remove();
  }

  componentDidMount() {
    const list = firebase.database().ref("Contacts");
    list.on("value", snapshot => {
      let items = snapshot.val();
      let newList = [];
      for (let item in items) {
        newList.push({
          id: item,
          name: items[item].name,
          email: items[item].email,
          phone: items[item].phone
        });
      }
      this.setState({
        contacts: newList
      });
    });
  }

  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Contacts List</h1>
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={this.handleChange}
                value={this.state.name}
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                onChange={this.handleChange}
                value={this.state.email}
              />
              <input
                type="phone"
                name="phone"
                placeholder="Phone"
                onChange={this.handleChange}
                value={this.state.phone}
              />
              <button>Add Contact</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.contacts.map(contact => {
                  return (
                    <li key={contact.id}>
                      <h3>{contact.name}</h3>
                      <p>Email: {contact.email}</p>
                      <p>Phone: {contact.phone}</p>
                      <button onClick={() => this.removeItem(contact.id)}>
                        Remove Item
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
