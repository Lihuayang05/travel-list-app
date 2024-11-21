import React, { useState } from "react";

// Initial packing items
const initialItems = [
  { id: 1, description: "Shirt", quantity: 5, packed: false },
  { id: 2, description: "Pants", quantity: 2, packed: false },
];

function Logo() {
  return <h1>My Travel List</h1>;
}

function Form({ addItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleInputChange = (e) => {
    setDescription(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      addItem({ description, quantity });
      setDescription("");
      setQuantity(1);
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack?</h3>
      <select value={quantity} onChange={handleQuantityChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={handleInputChange}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function PackingList({ items, togglePacked, removeItem }) {
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;

  return (
    <div className="list">
      <div className="list-stats">
        <em>{packedItems} of {totalItems} items packed</em>
      </div>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: 0 }}>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            togglePacked={togglePacked}
            removeItem={removeItem}
          />
        ))}
      </ul>
    </div>
  );
}

function Item({ item, togglePacked, removeItem }) {
  return (
    <li
      onClick={() => togglePacked(item.id)}
      style={{ textDecoration: item.packed ? "line-through" : "none" }}
    >
      {item.description}({item.quantity}) 
      <button onClick={(e) => {
        e.stopPropagation(); 
        removeItem(item.id);
      }}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentage = totalItems ? (packedItems / totalItems) * 100 : 0;

  return (
    <footer className="stats">
      <em>
        You have {totalItems} items in the list. You already packed {packedItems} ({percentage.toFixed(2)}%).
      </em>
    </footer>
  );
}

function App() {
  const [items, setItems] = useState(initialItems);

  const addItem = (newItem) => {
    setItems((prevItems) => [
      ...prevItems,
      { ...newItem, id: Date.now(), packed: false },
    ]);
  };

  const togglePacked = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="app">
      <Logo />
      <Form addItem={addItem} />
      <PackingList
        items={items}
        togglePacked={togglePacked}
        removeItem={removeItem}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
