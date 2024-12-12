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
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupDetails, setGroupDetails] = useState(null);
  const [watchDate, setWatchDate] = useState("");
  const [inviteCode, setInviteCode] = useState(""); // Invite code state
  const [inviteCodeToJoin, setInviteCodeToJoin] = useState(""); // State for joining a group with invite code

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200 && response.data.groups) {
        setGroups(response.data.groups);
      } else {
        setGroups([]);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching user groups.");
    }
  };

  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await axios.get(`${API_URL}/groups?groupid=${groupId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setGroupDetails(response.data); // Expect response in the new format
      } else {
        setGroupDetails(null);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching group details.");
    }
  };

  const handleRemoveMember = async (memberUsername) => {
    try {
      const response = await axios.delete(`${API_URL}/groups`, {
        headers: {
          Authorization: token,
        },
        data: {
          groupid: selectedGroup,
          username2: memberUsername, // Member to remove
        },
      });

      if (response.status === 200) {
        alert("User removed from the group successfully.");
        fetchGroupDetails(selectedGroup); // Refresh group details after removal
      } else {
        alert("Failed to remove user from the group.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing user from the group.");
    }
  };

  const handleAddToGroup = async (movie, watchDate) => {
    try {
      const response = await axios.post(
        `${API_URL}/groups/update`,
        {
          groupid: selectedGroup,
          movieName: movie.title,
          tmdbID: movie.id,
          watchDate: watchDate,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        alert("Movie added to the group successfully!");
        fetchGroupDetails(selectedGroup);
      } else {
        alert("Failed to add movie to the group. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding movie to the group. Please try again.");
    }
  };

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
        fetchUserGroups();
        alert("Group created successfully!");
      } else {
        alert("Failed to create group. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating group. Please try again.");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await axios.delete(`${API_URL}/groups`, {
        data: { groupid: groupId },
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        fetchUserGroups();
        alert("Group deleted successfully!");
      } else {
        alert("Failed to delete group. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting group. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies();
  };

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

  const handleGenerateInviteCode = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/groups?requestInviteCode=${selectedGroup}`, // Adjusted API route
        {
          headers: {
            Authorization: token, // Ensure the token is included for authentication
          },
        }
      );

      if (response.status === 200) {
        setInviteCode(response.data.inviteCode); // Set the generated invite code
        alert(`Invite code generated: ${response.data.inviteCode}`);
      } else {
        alert("Failed to generate invite code.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating invite code. Please try again.");
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/groups/join`, // Assuming you have an endpoint for joining with invite code
        { inviteCode: inviteCodeToJoin },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        alert("Successfully joined the group!");
        fetchUserGroups(); // Refresh groups
      } else {
        alert("Failed to join the group. Invalid invite code.");
      }
    } catch (err) {
      console.error(err);
      alert("Error joining the group. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserGroups();

    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("groupid");
    if (groupId) {
      setSelectedGroup(groupId);
      fetchGroupDetails(groupId);
    }
  }, [token]);

  return (
    <div className="group-page">
      <h2>Manage Groups and Movies</h2>

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

      {/* Section for Joining a Group with Invite Code */}
      <div className="join-group-section">
        <h3>Join Group with Invite Code</h3>
        <form onSubmit={handleJoinGroup}>
          <input
            type="text"
            value={inviteCodeToJoin}
            onChange={(e) => setInviteCodeToJoin(e.target.value)}
            placeholder="Enter invite code"
            className="join-group-input"
          />
          <button type="submit" className="button">
            Join Group
          </button>
        </form>
      </div>

      {groups.length > 0 && (
        <div className="group-list">
          <h3>Your Groups</h3>
          <table className="group-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>View Group</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.groupid}>
                  <td className="group-name">{group.name}</td>
                  <td>
                    <button
                      className="button"
                      onClick={() => {
                        window.location.search = `?groupid=${group.groupid}`;
                        fetchGroupDetails(group.groupid);
                      }}
                    >
                      View Group
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedGroup && groupDetails && (
        <div className="group-details-section">
          <h3>Group Details</h3>
          <p>
            <strong>Members:</strong>
          </p>
          <ul className="group-members-list">
            {groupDetails.members.map((member) => (
              <li key={member.username} className="group-member-item">
                {member.username}
                {member.isowner && <strong> (Owner)</strong>}
                {!member.isowner && (
                  <button
                    className="remove-member-button"
                    onClick={() => handleRemoveMember(member.username)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            className="button"
            onClick={handleGenerateInviteCode} // Invite code generation button
          >
            Generate Invite Code
          </button>

          {inviteCode && (
            <div className="invite-code-section">
              <p>Invite Code: {inviteCode}</p>
            </div>
          )}

          <h4>Movies in Group:</h4>
          <ul className="movies-list">
            {groupDetails.movies.length > 0 ? (
              groupDetails.movies.map((movie) => (
                <li key={movie.tmdbid} className="movie-item">
                  <span className="movie-name">{movie.name}</span>
                  <span className="movie-watchdate">
                    <br />
                    Watch Date: {new Date(movie.watchdate).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <p>No movies added yet.</p>
            )}
          </ul>

          <button className="button" onClick={() => setGroupDetails(null)}>
            Add Movie to Group
          </button>

          <button
            className="delete-button"
            onClick={async () => {
              await handleDeleteGroup(selectedGroup);
              window.location = `/group`;
            }}
          >
            Delete Group
          </button>
        </div>
      )}

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
                    onClick={() => handleAddToGroup(movie, watchDate)}
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
