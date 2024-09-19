import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import './Books.css'; 
import img from './././logo.png';


const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const handleFocus = () => {
    setPlaceholderVisible(false);
  };

  const handleBlur = () => {
    if (searchTerm === '') {
      setPlaceholderVisible(true);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/knjige.csv");
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);

      Papa.parse(csv, {
        header: true,
        complete: (result) => {
          setBooks(result.data);
        },
      });
    };

    fetchData();
  }, []);
  

  // Filtriraj knjige na osnovu unosa u pretrazi
  const filteredBooks = books.filter((book) =>
    book["Naziv knjige"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.Autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="netflix-container">
      <div className="container">
        <img src={img} alt="Logo" className="logo" />
        <h1 className="netflix-title">LISTA KNJIGA</h1>

        {/* Input za pretragu */}
        <input
      type="text"
      placeholder={placeholderVisible ? 'Pretraži po nazivu knjige ili autoru' : ''}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="search-input"
    />
      </div>
      

      <div className="book-grid">
        {filteredBooks.map((book, index) => (
          <div key={index} className="book-card">
            <img src={book.Korice} alt={book["Naziv knjige"]} className="book-cover" />
            <h3>{book["Naziv knjige"]}</h3>
            <div className="book-info">
              <p className="author">{book.Autor}</p>
              <p className="suggested-by">Predložio: {book.Predložio}</p> {book.Prevod === 'Yes' && (
                <p className="suggested-by">Ima Prevod</p>
              )}
              {book.Epizoda ? (
                <a href={book.Epizoda} target="_blank" rel="noopener noreferrer" className="episode-link">
                  Pogledaj Epizodu
                </a>
              ) : (
                <p className="no-episode">Nema epizode</p>
              )}
            </div>
            <div className="book-blur-background" style={{ backgroundImage: `url(${book.Korice})` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
