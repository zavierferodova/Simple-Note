import React from 'react'
import PropTypes from 'prop-types'

class NoteEdit extends React.Component {
  #titleLimit = 50
  #initialState = {
    id: '',
    title: '',
    body: ''
  }

  constructor (props) {
    super(props)

    if (props.value) {
      this.state = props.value
    } else {
      this.state = this.#initialState
    }

    this.onChangeTitleEventHandler = this.onChangeTitleEventHandler.bind(this)
    this.onChangeBodyEventHandler = this.onChangeBodyEventHandler.bind(this)
    this.onSubmitFormEventHandler = this.onSubmitFormEventHandler.bind(this)
  }

  /**
   * Handle change event on title input
   * @param {*} event
   */
  onChangeTitleEventHandler (event) {
    if (event.target.value.length <= this.#titleLimit) {
      this.setState((prevState) => {
        return {
          ...prevState,
          title: event.target.value
        }
      })
    }
  }

  /**
   * Handle change event on body input
   * @param {*} event
   */
  onChangeBodyEventHandler (event) {
    this.setState((prevState) => {
      return {
        ...prevState,
        body: event.target.value
      }
    })
  }

  /**
   * Handle submit event on note form
   * @param {*} event
   */
  onSubmitFormEventHandler (event) {
    event.preventDefault()
    if (this.props.onEditNote) {
      this.props.onEditNote({ ...this.state })
      this.setState({ ...this.#initialState })
    }
  }

  render () {
    return (
      <div className="note-input">
        <h2>Edit catatan</h2>
        <form onSubmit={this.onSubmitFormEventHandler}>
          <p className="note-input__title__char-limit">
            Sisa karakter: {this.#titleLimit - this.state.title.length}
          </p>
          <input
            className="note-input__title"
            required
            value={this.state.title}
            type="text"
            onChange={this.onChangeTitleEventHandler}
            placeholder="Ini adalah judul ..."/>
          <textarea
            required
            className="note-input__body"
            value={this.state.body}
            type="text"
            onChange={this.onChangeBodyEventHandler}
            placeholder="Tuliskan catatanmu di sini ..."></textarea>
          <button type="submit">Simpan</button>
        </form>
      </div>
    )
  }
}

NoteEdit.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    title: PropTypes.string,
    body: PropTypes.string
  }),
  onEditNote: PropTypes.func
}

export default NoteEdit
