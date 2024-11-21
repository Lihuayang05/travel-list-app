import React, { useState } from "react";

// Initial packing items
const initialItems = [
  { id: 1, description: "Shirt", quantity: 5, packed: false },
  { id: 2, description: "Pants", quantity: 2, packed: false },
  { id: 3, description: "Toothbrush", quantity: 1, packed: false },
  { id: 4, description: "Socks", quantity: 3, packed: true },
  { id: 5, description: "Shoes", quantity: 1, packed: false },
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

function PackingList({ items, togglePacked, removeItem, searchText, setSearchText, sortBy, setSortBy }) {
  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortBy === "name") {
      return a.description.localeCompare(b.description);
    }
    if (sortBy === "packed") {
      return a.packed === b.packed ? 0 : a.packed ? -1 : 1;
    }
    return a.quantity - b.quantity;
  });

  return (
    <div className="list">
      <div className="list-controls">
        <input
          type="text"
          placeholder="Search items..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="packed">Sort by Packed Status</option>
          <option value="quantity">Sort by Quantity</option>
        </select>
      </div>
      <div className="list-stats">
        <em>{filteredItems.length} items found</em>
      </div>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: 0 }}>
        {sortedItems.map((item) => (
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
      {item.description} ({item.quantity})
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeItem(item.id);
        }}
      >
        ❌
      </button>
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
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("name");

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
        searchText={searchText}
        setSearchText={setSearchText}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
