import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../components/UserProvider.js";
import "../styles/Group.css";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_URL = "https://moviexplorer.site";

function GroupPage() {
  const { token } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track selected group for adding movies
  const [groupDetails, setGroupDetails] = useState(null); // Store group details (members and movies)
  const [watchDate, setWatchDate] = useState(""); // Initialize watchDate state

  // Fetch user groups on component mount and after group creation
  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200 && response.data.groups) {
        setGroups(response.data.groups); // Store the groups, including their IDs and names
      } else {
        setGroups([]); // If no groups, clear the list
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching user groups.");
    }
  };

  // Fetch group details (members and movies) based on group ID from URL params
  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await axios.get(`${API_URL}/groups?groupid=${groupId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setGroupDetails(response.data); // Store group details including members and movies
      } else {
        setGroupDetails(null); // If no group details found, clear the details
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching group details.");
    }
  };

  // Add movie to group
  const handleAddToGroup = async (movie, watchDate) => {
    try {
      const response = await axios.post(
        `${API_URL}/groups/update`,
        {
          groupid: selectedGroup,
          movieName: movie.title,
          tmdbID: movie.id,
          watchDate: watchDate, // Pass the watch date
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        alert("Movie added to the group successfully!");
        fetchGroupDetails(selectedGroup); // Refresh group details after adding movie
      } else {
        alert("Failed to add movie to the group. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding movie to the group. Please try again.");
    }
  };
  // Create a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/groups`,
        {
          groupName: newGroupName,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        setNewGroupName("");
        fetchUserGroups(); // Refetch groups after creation
        alert("Group created successfully!");
      } else {
        alert("Failed to create group. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating group. Please try again.");
    }
  };

  // Delete a group
  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await axios.delete(`${API_URL}/groups`, {
        data: { groupid: groupId },
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        fetchUserGroups(); // Refetch groups after deletion
        alert("Group deleted successfully!");
      } else {
        alert("Failed to delete group. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting group. Please try again.");
    }
  };

  // Search movies handler
  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies();
  };

  // Fetch movies from TMDB
  const searchMovies = async () => {
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          query: searchQuery,
          include_adult: false,
          language: "en-US",
        },
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY2}`,
        },
      });
      setMovies(response.data.results || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching movies. Please try again.");
    }
    setIsLoading(false);
  };

  // Fetch user groups when the component mounts
  useEffect(() => {
    fetchUserGroups();

    // Check if there's a groupid in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("groupid");
    if (groupId) {
      setSelectedGroup(groupId);
      fetchGroupDetails(groupId); // Fetch details for the specific group
    }
  }, [token]);

  return (
    <div className="group-page">
      <h2>Manage Groups and Movies</h2>

      {/* Create Group */}
      <form onSubmit={handleCreateGroup} className="create-group-form">
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter new group name"
          className="create-group-input"
        />
        <button type="submit" className="button">
          Create Group
        </button>
      </form>

      {/* Display Groups */}
      {groups.length > 0 && (
        <div className="group-list">
          <h3>Your Groups</h3>
          <ul>
            {groups.map((group) => (
              <li key={group.groupid}>
                <span className="group-name">{group.name}</span>
                <button
                  className="button remove"
                  onClick={async () => {
                    await handleDeleteGroup(group.groupid);
                    window.location = `/group`;
                  }} // Use the correct group ID here
                >
                  Delete
                </button>
                <button
                  className="button"
                  onClick={() => {
                    window.location.search = `?groupid=${group.groupid}`;
                    fetchGroupDetails(group.groupid); // Redirect and fetch group details
                  }}
                >
                  View Group
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show Group Details when a group is selected */}
      {selectedGroup && groupDetails && (
        <div className="group-details-section">
          <h3>Group Details</h3>
          <p>
            <strong>Members:</strong>
          </p>
          <ul className="group-members-list">
            {groupDetails.members.map((member) => (
              <li key={member.id} className="group-member-item">
                {member.username}
              </li>
            ))}
          </ul>

          <h4>Movies in Group:</h4>
          <ul className="movies-list">
            {groupDetails.movies.length > 0 ? (
              groupDetails.movies.map((movie) => (
                <li key={movie.tmdbid} className="movie-item">
                  <span className="movie-name">{movie.name}</span>
                  <span className="movie-watchdate">
                  <br></br>
                    Watch Date: {new Date(movie.watchdate).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <p>No movies added yet.</p>
            )}
          </ul>

          {/* Add Movie Button */}
          <button
            className="button"
            onClick={() => setGroupDetails(null)} // Reset to movie search if user wants to add a movie
          >
            Add Movie to Group
          </button>
        </div>
      )}

      {/* Show Add Movie Section when a group is selected */}
      {selectedGroup && !groupDetails && (
        <div className="add-movie-section">
          <h3>Add Movies to Group</h3>
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="search-input"
            />
            <input
              type="datetime-local"
              value={watchDate}
              onChange={(e) => setWatchDate(e.target.value)}
              placeholder="Select Watch Date"
            />
            <button type="submit" className="button">
              Search
            </button>
          </form>

          {isLoading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}

          {movies.length > 0 && (
            <div className="movies-list">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <h4>{movie.title}</h4>
                  <button
                    className="button"
                    onClick={() => handleAddToGroup(movie, watchDate)} // Pass watchDate here
                  >
                    Add to Group
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GroupPage;
