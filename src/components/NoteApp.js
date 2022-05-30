import React from 'react'
import NoteSearch from './NoteSearch'
import NoteInput from './NoteInput'
import NoteEdit from './NoteEdit'
import NotesList from './NoteList'
import RenderIf from './RenderIf'
import { getInitialData } from '../utils'

class NoteApp extends React.Component {
  constructor () {
    super()
    this.state = {
      searchQuery: '',
      editingNoteId: '',
      notes: getInitialData()
    }

    this.onSearchChangeEventHandler = this.onSearchChangeEventHandler.bind(this)
    this.onEditNoteEventHandler = this.onEditNoteEventHandler.bind(this)
    this.onAddNoteEventHandler = this.onAddNoteEventHandler.bind(this)
    this.onUpdateNoteEventHandler = this.onUpdateNoteEventHandler.bind(this)
    this.onArchieveNoteEventHandler = this.onArchieveNoteEventHandler.bind(this)
    this.onDeleteNoteEventHandler = this.onDeleteNoteEventHandler.bind(this)
  }

  /**
   * Handle change event on search input
   * @param {*} event
   */
  onSearchChangeEventHandler (event) {
    this.setState((prevState) => {
      return {
        ...prevState,
        searchQuery: event.target.value
      }
    })
  }

  /**
   * Handle note edit event
   * @param {string|number} id
   */
  onEditNoteEventHandler (id) {
    scrollTo(0, 0)
    this.setState((prevState) => {
      return {
        ...prevState,
        editingNoteId: id
      }
    })
  }

  /**
   * Handle add note event
   * @param {object} data
   * @param {string} data.title
   * @param {string} data.body
   */
  onAddNoteEventHandler ({ title, body }) {
    this.setState((prevState) => {
      return {
        ...prevState,
        notes: [
          ...prevState.notes,
          {
            id: +Date.now(),
            title,
            body,
            createdAt: new Date().toISOString(),
            archived: false
          }
        ]
      }
    })
  }

  /**
   * Handle update note event
   * @param {string|number} id
   */
  onUpdateNoteEventHandler ({ id, title, body }) {
    this.setState((prevState) => {
      return {
        ...prevState,
        editingNoteId: '',
        notes: prevState.notes.map(note => {
          if (note.id === id) {
            return {
              ...note,
              title,
              body
            }
          }
          return note
        })
      }
    })
  }

  /**
   * Handle delete note event
   * @param {string|number} id
   */
  onDeleteNoteEventHandler (id) {
    this.setState((prevState) => {
      return {
        ...prevState,
        notes: prevState.notes.filter(note => note.id !== id)
      }
    })
  }

  /**
   * Handle archieve note event
   * @param {string|number} id
   */
  onArchieveNoteEventHandler (id) {
    this.setState((prevState) => {
      return {
        ...prevState,
        notes: prevState.notes.map(note => {
          if (note.id === id) {
            return {
              ...note,
              archived: !note.archived
            }
          }
          return note
        })
      }
    })
  }

  render () {
    let notes = this.state.notes
    let edittedNote = null

    if (this.state.searchQuery) {
      notes = notes.filter(note => note.title.toLowerCase().includes(this.state.searchQuery.toLowerCase()))
    }

    if (this.state.editingNoteId) {
      edittedNote = notes.find(note => note.id === this.state.editingNoteId)
    }

    const activeNotes = notes.filter(note => !note.archived)
    const archivedNotes = notes.filter(note => note.archived)

    return (
      <>
        <div className="note-app__header">
          <h1>Notes</h1>
          <NoteSearch
            value={this.state.searchQuery}
            onChange={this.onSearchChangeEventHandler}
            />
        </div>
        <div className="note-app__body">
          <RenderIf condition={!edittedNote}>
            <NoteInput onAddNote={this.onAddNoteEventHandler}/>
          </RenderIf>
          <RenderIf condition={Boolean(edittedNote)}>
            <NoteEdit
              value={edittedNote}
              onEditNote={this.onUpdateNoteEventHandler}
              />
          </RenderIf>
          <div className="note-app__body">
            <h2>Catatan Aktif</h2>
            <RenderIf condition={activeNotes.length > 0}>
              <NotesList
                notes={activeNotes}
                onEditNote={this.onEditNoteEventHandler}
                onDeleteNote={this.onDeleteNoteEventHandler}
                onArchieveNote={this.onArchieveNoteEventHandler}
                />
            </RenderIf>
            <RenderIf condition={activeNotes.length === 0}>
              <p className="notes-list__empty-message">Tidak ada catatan</p>
            </RenderIf>
            <h2>Arsip</h2>
            <RenderIf condition={archivedNotes.length > 0}>
              <NotesList
                notes={archivedNotes}
                onEditNote={this.onEditNoteEventHandler}
                onDeleteNote={this.onDeleteNoteEventHandler}
                onArchieveNote={this.onArchieveNoteEventHandler}
                />
            </RenderIf>
            <RenderIf condition={archivedNotes.length === 0}>
              <p className="notes-list__empty-message">Tidak ada catatan</p>
            </RenderIf>
          </div>
        </div>
      </>
    )
  }
}

export default NoteApp
