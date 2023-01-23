import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';


function getFormattedDate(date) {
  if (date == null) {
    return "";
  }
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year;
}


function reviveDate(strDate) {

  if (strDate == null)
    return null;

  let dateObj = new Date(strDate);
  if (isNaN(dateObj.getTime())) {
    dateObj = null;
  }

  return dateObj;
}


function Header() {
  return (
    <header className="text-center">
      <h1>5774 Todo List</h1>
    </header>
  )
}

function Footer() {
  return (
    <footer>
      <nav className="navbar navbar-expand-lg  fixed-bottom  navbar-dark bg-dark">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">CS5774 Quick Links</a>
          </div>
          <ul className="nav navbar-nav justify-content-end">
            <li className="nav-item"><a target="_blank" className="nav-link" href="https://canvas.vt.edu/courses/156133">Canvas</a></li>
            <li className="nav-item"><a target="_blank" className="nav-link" href="https://piazza.com/class/l6xy6lt494h1cb">Piazza </a></li>
            <li className="nav-item"><a target="_blank" className="nav-link" href="https://calendar.google.com/calendar/u/0/embed?src=vt.edu_5tmbc6074d596tpc5a831qo3j0@group.calendar.google.com&ctz=America/New_York">Office Hours</a></li>
          </ul>
        </div>
      </nav>
    </footer>
  )
}

function NavBar(props) {

  return (
    <nav className="mt-3 navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Todo List</a>
        </div>
        <ul className="nav navbar-nav justify-content-end">
          <li id="refresh" className="nav-item"><a className="nav-link" href="#"><i className="bi bi-arrow-repeat"></i> Refresh</a></li>
          <li id="overdue" className="nav-item"><a className="nav-link" href="#"><i className="bi bi-fire"></i> Overdue</a></li>
        </ul>
      </div>
    </nav>
  );
}


function TodoItem(props) {

  const [tasks, setTasks] = useState([]);
  useEffect(function () {
    fetch("./fetchtasks")
      .then(response => response.json())
      .then(obj => {
        console.log(obj);
        setTasks(obj.data);
      })
  }, [props.fetchCounter])
  return (
    tasks.map(function (element) {

      let dueDate = element.dueDate != null ? getFormattedDate(new Date(element.dueDate)) : "";
      let dateNow = new Date();
      let isDue = element.dueDate != null && dateNow >= new Date(dueDate);

      const [checked, setCheked] = useState(false)

      return (
        <tr key={element._id} className={(isDue ? 'table-danger' : '')}>
          <td className="text-center"><input type="checkbox" className="form-check-input" /></td>
          <td className="text-left">{element.title}</td>
          <td className="text-center">{dueDate}</td>
          <td className="text-center"></td>
          <td className="text-center">
            <button type="button" className="btn btn-danger btn-xs" alt="Delete the task">
              <i className="bi bi-trash"></i>
            </button> &nbsp;
            <a target="_blank" href="mailto:?subject=Buying%20Toilet%20Paper" >
              <button type="button" className="btn btn-info btn-xs" alt="Send an email">
                <i className="bi bi-envelope"></i>
              </button>
            </a>
          </td>
        </tr>
      );
    })
  )
}


function TodoList(props) {

  const [fetchCounter, setFetchCounter] = useState(0);
  function increFetchCount() {
    setFetchCounter(fetchCounter + 1);
  }

  return (
    <main>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Done</th>
            <th className="text-center">Task</th>
            <th className="text-center">Due date</th>
            <th className="text-center">Complete date</th>
            <th className="text-center">Tools</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr><td colSpan="5"> Hurrah! There is nothing to do! Wait, are you sure? </td></tr> */}
          <TodoItem fetchCounter={fetchCounter} />
          <UpdateTask />
          <NewTask tellMeWhenYouSubmit={increFetchCount} />
        </tbody>
      </table>
    </main>
  );
}

function NewTask(props) {
  const [dueDate, setDueDate] = useState(null);
  const [title, setTitle] = useState("");

  function updateTitle(event) {
    setTitle(event.target.value);
  }

  function addTask() {
    if (title.length == 0) {
      alert("Task title is required");
      return;
    }
    fetch("./newtask", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        dueDate: (dueDate == null ? null : new Date(dueDate))
      })
    }
    )
      .then(response => response.json())
      .then(obj => {
        console.log(obj);
        props.tellMeWhenYouSubmit();
        setTitle("");
        setDueDate(null);
      })
  }

  return (
    <tr className="border">
      <td className="text-center" style={{ verticalAlign: "middle" }}>
        New Task
      </td>
      <td className="text-center"><input type="text" className="form-control" placeholder="Type your task here. (Required)" value={title} onChange={updateTitle} /></td>
      <td className="text-center" ><DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} /></td>
      <td className="text-end" colSpan="2">
        <button type="button" className="btn btn-default btn-success" alt="Add New Task" onClick={addTask}>
          <i className="bi bi-plus-square"></i> Add New Task
        </button>
      </td>
    </tr>
  );
}


function UpdateTask(props) {

  return (
    <tr>
      <td className="text-center" style={{ verticalAlign: "middle" }}>
        Update Task
      </td>
      <td className="text-center"><input type="text" className="form-control" placeholder="Type your task here. (Required)" value="Assignment 5 due" /></td>
      <td className="text-center" ><input type="text" className="form-control" placeholder="Due Date(mm/dd/yyyy)" value="12/08/2022" /></td>
      <td className="text-end" colSpan="2">
        <button type="button" className="btn btn-default btn-warning" alt="Update Task">
          <i className="bi bi-pencil-square"></i> Update
        </button>
      </td>
    </tr>
  );
}


function App() {
  return (
    <div className="App">
      <Header />
      <NavBar />
      <TodoList />
      <br /><br /><br />
      <Footer />
    </div>
  );
}

export default App;