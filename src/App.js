import React, { Component } from "react";
import Header from "./Header";
import NotesList from "./NotesList";

class App extends Component {
  state = {
    notes: [
      {
        id: Date.now(),
        title: "",
        description: "",
        doesMatchSearch: true
      }
    ],
    searchText: ""
  };

  addNote = () => {
    //create a new note
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      doesMatchSearch: true
    };

    //add the new note to existing notes array in State
    const newNotes = [newNote, ...this.state.notes];
    this.setState({ notes: newNotes });
  };

  onType = (editMeId, updatedKey, updatedValue) => {
    // editMeID == ID of the note that is edited
    // updatedKey == title or description *field*
    // updatedValue == *value* of title or description that is updated
    const updatedNotes = this.state.notes.map((note) => {
      if (note.id !== editMeId) {
        return note;
      } else {
        if (updatedKey === "title") {
          note.title = updatedValue;
          return note;
        } else {
          note.description = updatedValue;
          return note;
        }
      }
    });
    this.setState({ note: updatedNotes });
  };

  onSearch = (text) => {
    const newSearchText = text.toLowerCase();
    const updatedNotes = this.state.notes.map((note) => {
      // first check for search text
      // if no search text, update each note's doesMatchSearch to true and return each note unchanged
      if (!newSearchText) {
        note.doesMatchSearch = true;
        return note;
      } else {
        // when there is text in the search, then update title and description to lower case so text can be found by newSearchText (i.e. search text is not case dependent)
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        // test to see if title or description has text being searched for
        const titleMatch = title.includes(newSearchText);
        const descriptionMatch = description.includes(newSearchText);
        // then retrieve where match with search found in title or description
        const hasMatch = titleMatch || descriptionMatch;
        note.doesMatchSearch = hasMatch; // i.e. doesMatchSearch is true if hasMatch is true, or false if hasMatch is false
        return note;
      }
    });
    // update state to the updatedNotes and updated newSearchText
    this.setState({
      notes: updatedNotes,
      searchText: newSearchText
    });
  };

  //function to delete notes
  removeNote = (noteId) => {
    const updatedNotes = this.state.notes.filter((note) => note.id !== noteId);
    this.setState({ notes: updatedNotes });
  };

  //save to local storage
  componentDidUpdate() {
    const stringifiedNotes = JSON.stringify(this.state.notes);
    localStorage.setItem("savedNotes", stringifiedNotes);
  }
  //mount notes saved to local storage
  componentDidMount() {
    const stringifiedNotes = localStorage.getItem("savedNotes");
    if (stringifiedNotes) {
      const savedNotes = JSON.parse(stringifiedNotes);
      this.setState({ notes: savedNotes });
    }
  }

  render() {
    return (
      <div>
        <Header
          onSearch={this.onSearch}
          addNote={this.addNote}
          searchText={this.state.searchText}
        />
        <NotesList
          removeNote={this.removeNote}
          onType={this.onType}
          notes={this.state.notes}
        />
      </div>
    );
  }
}

export default App;
