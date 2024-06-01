import React, { createContext, useState } from 'react';

// Create the context
export const PlaylistContext = createContext();

// Create the context provider
export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);

  // Function to add a movie to the playlist
  const addToPlaylist = (movie) => {
    setPlaylist([...playlist, movie]);
  };

  // Function to remove a movie from the playlist
  const removeFromPlaylist = (movie) => {
    setPlaylist(playlist.filter((m) => m.imdbID !== movie.imdbID));
  };

  return (
    <PlaylistContext.Provider value={{ playlist, addToPlaylist, removeFromPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};
