import React, { useState, useEffect } from 'react';

export default function GroupDetail({ group, onRemoveGroup }) {
    const [movies, setMovies] = useState(group.movies || []);
    const [showtimes, setShowtimes] = useState(group.showtimes || []);
    const [members, setMembers] = useState(group.members || []);
    const [newMovie, setNewMovie] = useState('');
    const [newShowtime, setNewShowtime] = useState({});
    const [newMember, setNewMember] = useState('');

    useEffect(() => {
        setMovies(group.movies || []);
        setShowtimes(group.showtimes || []);
        setMembers(group.members || []);
    }, [group]);

    const handleAddMovie = () => {
        if (newMovie.trim() === '') {
            alert('Movie name cannot be empty.');
            return;
        }
        const updatedMovies = [...movies, { name: newMovie, showtimes: [] }];
        setMovies(updatedMovies);
        group.movies = updatedMovies;
        setNewMovie('');
    };

    const handleAddShowtime = (movieName) => {
        if (!newShowtime[movieName] || newShowtime[movieName].trim() === '') {
            alert('Showtime cannot be empty.');
            return;
        }
        const updatedMovies = movies.map((movie) => {
            if (movie.name === movieName) {
                return {
                    ...movie,
                    showtimes: [...movie.showtimes, newShowtime[movieName]],
                };
            }
            return movie;
        });
        setMovies(updatedMovies);
        group.movies = updatedMovies;
        setNewShowtime({ ...newShowtime, [movieName]: '' });
    };

    const handleAddMember = () => {
        if (newMember.trim() === '') {
            alert('Member name cannot be empty.');
            return;
        }
        const updatedMembers = [...members, newMember];
        setMembers(updatedMembers);
        group.members = updatedMembers;
        setNewMember('');
    };

    const handleRemoveMember = (member) => {
        const updatedMembers = members.filter((m) => m !== member);
        setMembers(updatedMembers);
        group.members = updatedMembers;
    };

    const handleRemoveGroup = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this group?');
        if (confirmDelete && onRemoveGroup) {
            onRemoveGroup(group.id); 
        }
    };

    return (
        <div className="group-detail">
            <h2>{group.name} - Group Details</h2>

            <section className="movie-section">
                <h3>Movies and Showtimes</h3>
                <table className="movie-table">
                    <thead>
                        <tr>
                            <th>Movie Name</th>
                            <th>Showtimes</th>
                            <th>Add Showtime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie, index) => (
                            <tr key={index}>
                                <td>{movie.name}</td>
                                <td>
                                    <ul>
                                        {movie.showtimes.map((time, idx) => (
                                            <li key={idx}>{time}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newShowtime[movie.name] || ''}
                                        onChange={(e) =>
                                            setNewShowtime({
                                                ...newShowtime,
                                                [movie.name]: e.target.value,
                                            })
                                        }
                                        placeholder="Enter showtime"
                                    />
                                    <button onClick={() => handleAddShowtime(movie.name)}>
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="add-movie">
                    <h4>Add New Movie</h4>
                    <input
                        type="text"
                        value={newMovie}
                        onChange={(e) => setNewMovie(e.target.value)}
                        placeholder="Enter movie name"
                    />
                    <button onClick={handleAddMovie}>Add Movie</button>
                </div>
            </section>

            <section className="member-section">
                <h3>Members</h3>
                <ul className="member-list">
                    {members.map((member, index) => (
                        <li key={index} className="member-item">
                            <span className="member-name">{member}</span>
                            <button onClick={() => handleRemoveMember(member)} className="button remove">
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="add-member">
                    <h4>Add New Member</h4>
                    <input
                        type="text"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        placeholder="Enter member name"
                        className="member-input"
                    />
                    <button onClick={handleAddMember} className="button add">
                        Add Member
                    </button>
                </div>
            </section>

        </div>
    );
}
