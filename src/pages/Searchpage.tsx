import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(`/api/crawl?baseUrl=${query}&curUrl=${query}`);
      
      if (!res.ok) {
        throw new Error('Error fetching search results');
      }
      const data = await res.json();
      setResults(Object.entries(data).map(([url]) => url));
    } catch (err : any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Search - Web Crawler</title>
      </Head>
      <h1>Web Crawler Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          required
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul className="results-list">
        {results.map((result, index) => (
          <li key={index} className="result-item">
            <a href={result} className="result-link" target="_blank" rel="noopener noreferrer">{result}</a>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
          color: #333;
        }
        form {
          margin-bottom: 20px;
        }
        .search-input {
          padding: 10px;
          font-size: 1.2em;
          width: calc(100% - 120px);
          margin-right: 10px;
        }
        .search-button {
          padding: 10px 20px;
          font-size: 1.2em;
          cursor: pointer;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 5px;
        }
        .error-message {
          color: red;
          margin: 20px 0;
        }
        .results-list {
          list-style: none;
          padding: 0;
        }
        .result-item {
          margin-bottom: 10px;
        }
        .result-link {
          text-decoration: none;
          color: #0070f3;
        }
      `}</style>
    </div>
  );
}
