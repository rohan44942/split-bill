import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Tushar",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -1000,
  },
  {
    id: 933372,
    name: "Abhijit",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "yug",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  // const fakeFriend = {
  //   name: "hi_Rohan",
  //   id: crypto.randomUUID(),
  //   balance: null,
  //   image: `https://i.pravatar.cc/48?u=${crypto.randomUUID()}`,
  // };
  const [friends, SetFriends] = useState(initialFriends);
  const [newFriend, setNewFriend] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const newFriendImage = `https://i.pravatar.cc/48?u=${Math.floor(100) * 100}`;

  function handleformSubmission(e) {
    e.preventDefault();
    if (newFriend === "") return;

    const friend = {
      id: Math.random(),
      name: newFriend,
      image: `https://i.pravatar.cc/48?u=${Math.floor(Math.random()) * 100}`,
      balance: 0,
    };

    SetFriends((prevFriends) => [...prevFriends, friend]);
    setNewFriend(""); // Clear the input field after adding a friend
  }
  function ShowFriendForm(e) {
    setShowAddFriend(!showAddFriend);
  }
  // function handleshowSplitBillForm() {
  //   setSplitBillForm(!showSplitBillForm);
  //   setSelectFriendSplitBill()
  // }
  function handleFriendSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function hanleSpliFormSubmission(value) {
    console.log(value);
    SetFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="container">
      <div>
        <header>
          <h1 className="heading">Split the bill 💵 </h1>
        </header>
      </div>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            ShowFriendForm={ShowFriendForm}
            onSelection={handleFriendSelection}
            selectedFriend={selectedFriend}
          />
          {showAddFriend ? (
            <AddFriendForm
              friends={friends}
              setNewFriend={setNewFriend}
              onhandleformsubmission={handleformSubmission}
              newFriend={newFriend}
              newFriendImage={newFriendImage}
              ShowFriendForm={ShowFriendForm}
            />
          ) : null}
          {showAddFriend && <Button onClick={ShowFriendForm}>close</Button>}
        </div>

        <div>
          {selectedFriend && (
            <SplitBillForm
              selectedFriend={selectedFriend}
              onSubmissionSplitForm={hanleSpliFormSubmission}
              key={selectedFriend.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
function FriendList({ friends, ShowFriendForm, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
      <Button onClick={ShowFriendForm}>Add friend</Button>
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="hii"></img>
      <h3> {friend.name}</h3>
      <p
        className={
          friend.balance === 0 ? "green" : friend.balance < 0 ? "red" : "green"
        }
      >
        {friend.balance === 0
          ? " you are equal"
          : friend.balance < 0
          ? `your friend owes you ${Number(friend.balance)}`
          : `you owes  ${Number(friend.balance)} from your friends `}
      </p>
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? `close ` : "select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}{" "}
    </button>
  );
}
function AddFriendForm({
  friends,
  onhandleformsubmission,
  newFriend,
  newFriendImage,
  setNewFriend,
}) {
  function handleNewFriend(e) {
    setNewFriend((a) => e.target.value);
  }

  return (
    <div className="sidebar" onSubmit={onhandleformsubmission}>
      <form className="form-add-friend">
        <label>add friend</label>
        <input type="text" value={newFriend} onChange={handleNewFriend}></input>
        <label>image url</label>
        <input type="url" value={newFriendImage}></input>
        <Button>Add</Button>
      </form>
    </div>
  );
}
function SplitBillForm({ selectedFriend, onSubmissionSplitForm }) {
  const [bill, setBill] = useState(null);
  const [paidByFriend, setpaidByFriend] = useState(null);
  const remainingBill = bill - paidByFriend;
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    console.log("in handle submit form event is trigered");
    if (bill === 0 || paidByFriend === 0) return;
    console.log("in return");

    onSubmissionSplitForm(
      whoIsPaying === "user" ? remainingBill : -remainingBill
    );
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h3>Split the bill with {selectedFriend.name} </h3>
      <br></br>
      <label>💵 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>

      <label>👨‍🦱 Your expense</label>
      <input
        type="text"
        value={paidByFriend}
        onChange={(e) =>
          setpaidByFriend(
            Number(e.target.value) < bill
              ? Number(e.target.value)
              : paidByFriend
          )
        }
      ></input>

      <label>👨‍🦱 {selectedFriend.name} expense</label>
      <input type="text" value={remainingBill} disabled></input>

      <label>🤑 who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(Number(e.target.value))}
      >
        <option>user</option>
        <option>{selectedFriend.name}</option>
      </select>
      <Button>split bill</Button>
    </form>
  );
}
