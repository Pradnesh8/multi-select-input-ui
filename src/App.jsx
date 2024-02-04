
import { useEffect, useRef, useState } from 'react'
import './App.css'
import Pills from './components/pills';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersSet, setSelectedUsersSet] = useState(new Set());
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const inputRef = useRef();
  const timer = useRef();

  const handleSelect = (user) => {
    setActiveSearchIndex(0);
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUsersSet(new Set([...selectedUsersSet, user.email]))
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus()
  }
  const handleDelete = (user) => {
    const users = selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
    setSelectedUsers(users);
    const setUsers = selectedUsersSet;
    setUsers.delete(user.email);
    setSelectedUsersSet(new Set([...setUsers]))
    inputRef.current.focus()
  }
  const handleKeyDown = (e) => {
    // console.log(`${e.key} pressed`);
    if (e.key === 'Backspace' && e.target.value === "" && selectedUsers.length > 0) {
      const user = selectedUsers[selectedUsers.length - 1];
      handleDelete(user);
      setSuggestions([]);
    }
    else if (e.key === "ArrowDown" && suggestions.length > 0) {
      setActiveSearchIndex((prevIndex) => prevIndex + 1 <= suggestions.length - 1 ? prevIndex + 1 : prevIndex);

    }
    else if (e.key === "ArrowUp" && suggestions.length > 0) {
      setActiveSearchIndex((prevIndex) => prevIndex - 1 >= 0 ? prevIndex - 1 : prevIndex);
    }
    else if (e.key === 'Enter' && suggestions.length > 0 && activeSearchIndex < suggestions.length) {
      handleSelect(suggestions[activeSearchIndex]);

    }

  }
  useEffect(() => {
    clearTimeout(timer.current);
    console.log("DEBOUNCED");
    const getSuggestions = () => {
      // https://dummyjson.com/users/search?q=John
      if (searchTerm === "") {
        setSuggestions([]);
        return
      }
      setActiveSearchIndex(0);
      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then(res => res.json())
        .then(data => setSuggestions(data.users))
        .catch(err => console.log(err));
    }
    timer.current = setTimeout(() => {
      console.log("CALLED");
      getSuggestions();
    }, 500)
    return () => clearTimeout(timer.current)
  }, [searchTerm]);

  // console.log("ActiveSearchIndex", activeSearchIndex)
  return (
    <div className='user-search-container'>
      <div className='search-field'>
        {/* Pills */}
        {
          selectedUsers.map((user) => {
            return (
              <Pills key={user.email} image={user.image} text={user.firstName + " " + user.lastName} onClick={() => handleDelete(user)} />
            )
          })
        }
        {/* input field */}
        <input type="text" ref={inputRef} placeholder='Search users ...' name='search user' value={searchTerm} className='search-input' onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
      </div>
      {/* Suggestions */}
      {
        suggestions?.length > 0 &&
        <ul className='search-suggestions'>
          {
            suggestions?.map((user, index) => !selectedUsersSet.has(user.email) && <li key={user?.email} onClick={() => handleSelect(user)} className={`user-row ${index === activeSearchIndex ? 'active' : ''}`}><span><img src={user.image} alt={user.firstName + " " + user.lastName} /></span><span>{user.firstName} {user.lastName}</span></li>)
          }
        </ul>
      }

    </div>
  )
}

export default App
